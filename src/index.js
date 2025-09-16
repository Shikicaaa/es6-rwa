import { from, zip, of, tap, map, switchMap, catchError } from 'rxjs';
import { ApiService } from './services/ApiService';
import { generateWorkoutPlan } from './logic/PlanGenerator';
import { renderTypeButtons, renderPlan } from './ui/UIManager';

const api = new ApiService('http://localhost:3000');
const planContainer = document.getElementById('plan-container');
const rxjsOutput = document.getElementById('rxjs-output');

function initApp() {
    api.getWorkoutTypes()
        .then(types => {
            const selection$ = renderTypeButtons(types);

            selection$.pipe(
                tap(() => planContainer.innerHTML = '<h2>Učitavam plan...</h2>'),
                
                switchMap(({ typeId, goal }) => 
                    from(api.getExercisesByCategory(typeId)).pipe(
                        map(exercises => ({ exercises, typeId, goal }))
                    )
                ),
                
                map(({ exercises, typeId, goal }) => generateWorkoutPlan(exercises, typeId, goal))

            ).subscribe({
                next: (plan) => renderPlan(plan, planContainer),
                error: (err) => {
                    console.error(err);
                    planContainer.innerHTML = '<p>Greška pri učitavanju plana.</p>';
                }
            });
        })
        .catch(err => console.error("Ne mogu da uzmem tipove treninga", err));
}

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