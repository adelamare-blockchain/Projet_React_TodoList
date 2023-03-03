// Librairies
import React, { useState, useEffect, useRef } from 'react';
import classes from './App.module.css';
import Task from '../../Components/Task/Task';
import axios from '../Axios/axios-firebase';

// Components
import Spinner from '../../Components/UI/Spinner/Spinner';

function App() {
  // STATES
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Variable - Focus à l'input
  const elementInput = useRef(null);

  // ETATS
  // Cycle de vie
  useEffect(() => {
    // Récupérer les datas tasks (Firebase)
    fetchTasks();
  }, []);

  // METHODES - Fonctions
  // Méthode - Supprimer une tache
  const removeClickedHandler = (index) => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);

    // Supprimer datas sur FireBase
    axios
      .delete('/tasks/' + tasks[index].id + '.json')
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Méthode - Terminer une tache
  const doneClickedHandler = (index) => {
    const newTasks = [...tasks];
    newTasks[index].done = !tasks[index].done;
    setTasks(newTasks);

    // Modifier datas tasks sur Firebase
    axios
      .put('/tasks/' + tasks[index].id + '.json', newTasks[index])
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Méthode - Ajouter une tache
  const submittedTaskHandler = (event) => {
    event.preventDefault();

    const newTask = {
      content: input,
      done: false,
    };

    // Ajouter datas tasks sur Firebase
    axios
      .post('/tasks.json', newTask)
      .then((response) => {
        console.log(response);
        fetchTasks();
      })
      .catch((error) => {
        console.log(error);
      });

    setTasks([...tasks, newTask]);
    setInput('');
  };

  // Méthode - Changer le formulaire
  const changedFormHandler = (event) => {
    setInput(event.target.value);
  };

  // VARIABLES
  // Variable - Get datas tasks (pour envoi vers Firebase)
  const fetchTasks = () => {
    setLoading(true); // Afficher Spinner loading

    axios
      .get('/tasks.json')
      .then((response) => {
        const newTasks = [];

        for (let key in response.data) {
          newTasks.push({
            ...response.data[key],
            id: key,
          });
        }
        setTasks(newTasks);
        setLoading(false); // Arrêt Spinner Loading
        elementInput.current.focus();
      })
      .catch((error) => {
        console.log(error);
        setLoading(false); // Arrêt Spinner Loading
      });
  };

  // Variable - Affichage d'une nouvelle Task
  let addedTasksDisplayed = tasks.map((task, index) => (
    <Task
      done={task.done}
      content={task.content}
      key={index}
      removeClicked={() => removeClickedHandler(index)}
      doneClicked={() => doneClickedHandler(index)}
    />
  ));

  // Variable - Affichage des taches terminées
  // let doneTasksDisplayed = tasks
  //   .filter((task) => task.done)
  //   .map((filteredTask, index) => (
  //     <Task
  //       done={filteredTask.done}
  //       content={filteredTask.content}
  //       key={index}
  //       removeClicked={() => removeClickedHandler(index)}
  //       doneClicked={() => doneClickedHandler(index)}
  //     />
  //   ));
  // let countDonedTasks = tasks.filter((task) => task.done).length;

  return (
    <div className={classes.App}>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <header>
            <span>TO-DO LIST</span>
          </header>
          <div className={classes.add}>
            <form onSubmit={(e) => submittedTaskHandler(e)}>
              <input
                type='text'
                value={input}
                onChange={(e) => changedFormHandler(e)}
                placeholder='Que souhaitez-vous ajouter ?'
                ref={elementInput}
              />
              <button type='submit'>Ajouter</button>
            </form>
          </div>
          {addedTasksDisplayed}
        </>
      )}
    </div>
  );
}

export default App;
