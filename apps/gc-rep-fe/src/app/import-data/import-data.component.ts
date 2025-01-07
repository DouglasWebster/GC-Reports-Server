import { AsyncPipe, CommonModule } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { DbAccessService } from '../db-access/db-access.service';

@Component({
  selector: 'gc-rep-fe-import-data',
  imports: [CommonModule, AsyncPipe],
  templateUrl: './import-data.component.html',
  styleUrl: './import-data.component.css',
})
export class ImportDataComponent {
  selectedFile!: File;
  fileName = '';
  compResult: string | null = null;

  response$! : Observable<HttpResponse<string>>;
  constructor(private dbAccessService: DbAccessService) {}

  // @ts-expect-error Parameter '$event' implicitly has an 'any' type.ts(7006)
  onChange($event) {
    const file = $event.target.files[0];

    // const fileReader: FileReader = new FileReader();

    // eslint-disable-next-line
    // const self = this;

    if (file) {
      this.selectedFile = file;
      this.fileName = file.name;
      const fd = new FormData();

      fd.append('file', this.selectedFile, this.fileName);
      this.response$ =this.dbAccessService.addCompetion(fd)
    }
  }
}
