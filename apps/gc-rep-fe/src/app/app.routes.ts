import { Route } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ImportDataComponent } from './import-data/import-data.component';
import { ReviewCompComponent } from './review-comp/review-comp.component';
import { ResultsComponent } from './results/results.component';
import { AboutComponent } from './about/about.component';

export const appRoutes: Route[] = [
  {
    path: 'import-comp',
    component: ImportDataComponent,
  },
  { path: 'home', component: HomeComponent },
  { path: 'review', component: ReviewCompComponent},
  { path: 'results', component: ResultsComponent},
  { path: 'about', component: AboutComponent}
];
