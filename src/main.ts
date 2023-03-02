import { v4 as uuidv4 } from 'uuid';
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";
import './style.css'

const taskForm = document.querySelector<HTMLFormElement>('#task-form');
const taskList = document.querySelector<HTMLDivElement>('#task-list');

interface Task{
  title: string;
  description: string;
  id: string;
}

let tasks:Task[] = [];

taskForm?.addEventListener('submit', e => {
  e.preventDefault()

  const title = taskForm['title'] as unknown as HTMLInputElement
  const description = taskForm['description'] as unknown as HTMLTextAreaElement
  // Guardar los datos en el localStorage, se puede guardar como objeto pero para
  // este caso se guaradara en un arreglo como este puede ser multitarea
  tasks.push({
    title: title.value,
    description: description.value,
    id: uuidv4()
  })
  // Se convierte de objeto a string con JSON.stringify
  localStorage.setItem('tasks', JSON.stringify(tasks));

  Toastify({
    text: 'Tarea agregada con éxito',
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    },
  }).showToast();

  renderTask(tasks);

  taskForm.reset();
  title.focus();


});

// el metodo parse convierte de string a su formato normal, un objeto [{}]
document.addEventListener('DOMContentLoaded',()=>{
  tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  renderTask(tasks)
})

const renderTask = (tasks:Task[]):void => {
  // se puede usar un if como condicional para verificar si existe el elemento
  taskList!.innerHTML = '';
  
  tasks.forEach(task => {
    // console.log(task)
    const taskElement = document.createElement('div');
    taskElement.className = 'bg-zinc-800 mb-1 rounded-lg hover:bg-zinc-700 hover:cursor-pointer'

    const header = document.createElement('header');
    header.className = 'flex justify-between'

    const title = document.createElement('span');
    title.innerText = task.title;

    const btnDelete = document.createElement('button');
    btnDelete.className = 'bg-red-500 px-2 py-1 rounded-md hover:bg-red-800';
    btnDelete.innerText = 'Delete';

    btnDelete.addEventListener('click', () =>{
      const index = tasks.findIndex(t => t.id === task.id)
      console.log(index);
      tasks.splice(index, 1);
      //Para guardar este arreglo alterado, se usa el localStorage.setitem
      //se guarda dentro de tasks la conversion de stringify del arreglo
      // esto actualizara nuestro localStorage
      localStorage.setItem('tasks', JSON.stringify(tasks));
      renderTask(tasks);

      Toastify({
        text: 'Tarea eliminada con éxito',
      }).showToast();
    })

    header.append(title);
    header.append(btnDelete);

    const description = document.createElement('p');
    description.innerText = task.description;

    taskElement.append(header);
    taskElement.append(description);

    const id = document.createElement('p');
    id.innerText = task.id;
    id.className = 'text-gray-400 text-xs';
    taskElement.append(id);

    taskList?.append(taskElement);


  })

}

// function limpiarHtmlPrevio(){
//   while(taskList?.firstChild){
//     taskList.removeChild(taskList.firstChild);
//   }
// };