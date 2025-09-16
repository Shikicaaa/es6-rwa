const typeSelector = document.getElementById('type-selector');
const planContainer = document.getElementById('plan-container');

export function renderTypeButtons(types, selectCallback) {
    const container = document.getElementById('type-buttons');
    if (!container) {
        console.error('Ne postoji container za tipove treninga (id="type-buttons")');
        return;
    }

    container.innerHTML = '';

    types.forEach(type => {
        const btn = document.createElement('button');
        btn.textContent = type.name;
        btn.onclick = () => {
            if(type.id === "teretana") {
                const goal = prompt("Izaberi cilj: snaga ili hipertrofija", "hipertrofija");
                selectCallback(type.id, goal);
            } else {
                selectCallback(type.id);
            }
        };
        container.appendChild(btn);
    });
}


export function renderPlan(plan, container) {
    container.innerHTML = '';
    plan.forEach(day => {
        const dayCard = document.createElement('div');
        dayCard.classList.add('day-card');

        dayCard.innerHTML = `<h3>Dan ${day.day}: ${day.focus}</h3>`;
        const ul = document.createElement('ul');

        day.exercises.forEach(ex => {
            const li = document.createElement('li');
            li.textContent = `${ex.name} — ${ex.reps}`;
            ul.appendChild(li);
        });

        dayCard.appendChild(ul);
        container.appendChild(dayCard);
    });
}

