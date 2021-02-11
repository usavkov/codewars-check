const header = document.querySelector('header');
const tasksForm = document.forms.tasks; //document.querySelector('form[name=tasks]');
const taskFormElems = tasksForm.elements;
const tasksTextArea = document.querySelector('#tasksList');
const completedArea = document.querySelector('.output');
const userName = document.querySelector('#username');

const submitForm = document.querySelector('input[type=submit]');

submitForm.addEventListener('click', (ev) => {
    ev.preventDefault();
    completedArea.innerHTML = ''
    
    fetch('https://codewars-check.herokuapp.com/check', {
        method: 'post',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username: userName.value})
        })
        .then(res => res.json())
        .then(r => {
            
            const completedKatas = r.completed.flat();
            const slugs = [...completedKatas.map(o => o.slug)];

            const checked = checkKata(tasksTextArea.value, slugs);
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

            document.querySelector('h1').classList.add('hidden');
            
            document.querySelector('.user-image').src = r.avatar;
            document.querySelector('.name').textContent = r.name;
            document.querySelector('.user-name').textContent = r.name ? `@${r.username}` : 'Not found! Check "Username" field';
           
            document.querySelector('.rank').textContent = r.ranks.overall.name;
            document.querySelector('.rank').classList.remove('hidden');
            document.querySelector('.honor').textContent = r.honor;
            document.querySelector('.honor').classList.remove('hidden');
            document.querySelector('.leader-position').textContent = `№ ${r.leaderboardPosition}`;
            document.querySelector('.leader-position').classList.remove('hidden');
            document.querySelector('.total-kata').textContent = r.items;
            document.querySelector('.total-kata').classList.remove('hidden');
            
            document.querySelector('.total').textContent = `${checked.completed} / ${checked.required}`;

            return r; 
        });

})

function checkKata(requiredTasks, slugs) {
        const allCompletedTasks = [...slugs];

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
            required: tasksRequiered.length,
            completed: completedTasksCount,
            tasksName: tasksRequiered,
            checkedTasks: result,
            tasksLinks: tasksHrefs
        };

    return output;
}