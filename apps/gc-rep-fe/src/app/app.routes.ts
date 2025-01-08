import { Route } from '@angular/router';
import { ImportDataComponent } from './import-data/import-data.component';
import { HomeComponent } from './home/home.component';
import { ReviewComponent } from './review/review.component';

export const appRoutes: Route[] = [
  {
    path: 'import-comp',
    component: ImportDataComponent,
  },
  { path: 'home', component: HomeComponent },
  { path: 'review', component: ReviewComponent}
];
