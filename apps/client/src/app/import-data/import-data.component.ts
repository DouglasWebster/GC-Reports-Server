import { AsyncPipe, CommonModule } from '@angular/common';
// import { ChangeDetectorRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
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

  fd: FormData = new FormData();
  fileReader = new FileReader();
  rawData = '';
  fileNotImported = true;

  response$!: Observable<HttpResponse<string>>;
  constructor(
    private dbAccessService: DbAccessService // private ref: ChangeDetectorRef
  ) {}

  // @ts-expect-error Parameter '$event' implicitly has an 'any' type.ts(7006)
  onChange($event) {
    this.response$ = of();
    const file = $event.target.files[0];
    console.log(`User has selected a file.`);

    // eslint-disable-next-line
    const self = this;

    if (file) {
      this.fileNotImported = true;
      this.selectedFile = file;
      this.fileName = file.name;
      // this.fd = new FormData();
      this.fd.delete('file');

      this.fd.append('file', this.selectedFile, this.fileName);
      this.fileReader.onloadend = function () {
        self.rawData = self.fileReader.result as string;
      };
      this.fileReader.readAsText(file);
    } else {
      this.fileName = '';
      this.fd.delete('file');
      this.rawData = '';
    }
  }

  importFile() {
    console.log('importing file');
    this.response$ = this.dbAccessService.addCompetion(this.fd);
    this.fileNotImported = false;
  }
}
