function checkReq(url, options = {}) {
    return fetch(url, options)
}

const header = document.querySelector('header');
const tasksForm = document.forms.tasks; //document.querySelector('form[name=tasks]');
const taskFormElems = tasksForm.elements;
const tasksTextArea = document.querySelector('#tasksList');
const completedArea = document.querySelector('.output');
const userName = document.querySelector('#username');

const submitForm = document.querySelector('input[type=submit]');

submitForm.addEventListener('click', (ev) => {
    ev.preventDefault();
    
    const res = checkReq(`http://127.0.0.1/check`)
                .then(res => res.json())
                .then(r => {
                    
        
        const userImage = new Image(100, 100);
        userImage.classList.add('user-image');
        userImage.src = 'https://avatars.githubusercontent.com/u/36452096?s=100';
        header.appendChild(userImage);

        const checked = checkKata(tasksTextArea.value, r);
        checked.tasksName.forEach((el, i) => {
            
            const txt = `${i+1}. ${el.replaceAll('-', ' ').replace(el[0], el[0].toUpperCase())}: `;
            const a = document.createElement('a');
            const span = document.createElement('span');
            const pseudoAfter = document.createElement('p');

            pseudoAfter.textContent = checked.checkedTasks[el] ? 'Done!' : 'Not completed.'; 
            a.text = txt;
            a.href = checked.tasksLinks[i];
            a.setAttribute('target', '_blank')
            checked.checkedTasks[el] ? pseudoAfter.style.color = 'green' : pseudoAfter.style.color = 'red';

            
            span.appendChild(a);
            span.appendChild(pseudoAfter);
            completedArea.appendChild(span);
        });
        return r; 
    });

})

function checkKata(requiredTasks, apiResJSON) {
        const allCompletedTasks = [];
    
        apiResJSON.data.forEach(element => {
            allCompletedTasks.push(element.slug)
        });

        const reLink = /((http(s)?:\/\/)?(www\.)?)?codewars\.com\/kata\/[\/a-z0-9._&?%$-]*/i
        const reTask = /((http(s)?:\/\/)?(www\.)?)?codewars\.com\/kata\/([a-z0-9._&?%$-]*)+/i

        const tasksRequiered = [...requiredTasks
                            .split('\n')
                            .map(row => row.trim())
                            .filter(row => reLink.test(row))
                            .map(row => row.match(reTask)[5])
                        ];
        
        const result = tasksRequiered.reduce((acc, cur) => {
            acc[cur] = allCompletedTasks.includes(cur);
            return acc;
        }, {});
    
        const countTasks = tasksRequiered.length;
        const completedTasksCount = Object.values(result).filter(done => done === true).length;
        const tasksHrefs = [];

        tasksRequiered.forEach(el => tasksHrefs.push(`http://www.codewars.com/kata/${el}`))

        const output = {
            completed: completedTasksCount,
            tasksName: tasksRequiered,
            checkedTasks: result,
            tasksLinks: tasksHrefs
        };

    return output;
}