import { fromEvent, from, zip, merge, switchMap, map, takeUntil, catchError, of } from 'rxjs';
import { ApiService } from './services/ApiService';
import { generateWorkoutPlan } from './logic/PlanGenerator';
import { renderTypeButtons, renderPlan } from './ui/UIManager';

const api = new ApiService('http://localhost:3000');

const planContainer = document.getElementById('plan-container');

function selectWorkoutType(typeId, goal = "general") {
    console.log(`Odabran je tip: ${typeId}, cilj: ${goal}`);
    planContainer.innerHTML = '<h2>Učitavam plan...</h2>';

    from(api.getExercisesByCategory(typeId)).pipe(
        map(exercises => generateWorkoutPlan(exercises, typeId, goal))
    ).subscribe({
        next: (plan) => renderPlan(plan, planContainer),
        error: (err) => {
            console.error(err);
            planContainer.innerHTML = '<p>Greska pri ucitavanju plana.</p>';
        }
    });
}

function initApp() {
    api.getWorkoutTypes()
        .then(types => renderTypeButtons(types, selectWorkoutType))
        .catch(err => console.error("Ne mogu da uzmem tipove treninga", err));
}


const rxjsOutput = document.getElementById('rxjs-output');

const inspirationalData$ = zip(
    from(api.getTip()).pipe(catchError(err => of({ text: 'Nema saveta danas.' }))),
    from(api.getQuote()).pipe(catchError(err => of({ text: 'Nema citata danas.' })))
);

inspirationalData$.pipe(
    map(([tip, quote]) => `<strong>Savet:</strong> ${tip.text} <br> <strong>Citat:</strong> ${quote.text}`)
).subscribe(html => {
    rxjsOutput.innerHTML = html;
});

initApp();