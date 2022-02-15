import jsPDF from 'jspdf';
import * as ApexCharts from 'apexcharts';
import html2canvas from 'html2canvas';

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexTitleSubtitle,
} from 'ng-apexcharts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(private formBuilder: FormBuilder) {}

  @ViewChild('chart1', { static: false }) el!: ElementRef;

  form!: FormGroup;
  response$!: Observable<string>;
  title: ApexTitleSubtitle = { text: 'demo' };
  options2 = {
    chart: {
      id: 'chart1',
      type: 'bar',
      width: '1000px',
      height: '500px',
    },
    series: [{ name: 'Especie', data: [1, 2, 3, 4, 45, 5] }],
  };
  series: ApexAxisChartSeries = [
    { name: 'Especie', data: [1, 2, 3, 4, 45, 5] },
  ];
  chart: ApexChart = {
    id: 'chart1',
    type: 'bar',
    width: '1000px',
    height: '500px',
  };
  options = {
    chart: {
      type: 'bar',
      width: '300px',
      height: '200px',
    },
    series: [
      {
        name: 'sales',
        data: [30, 40, 45, 50, 49, 60, 70, 91, 125],
      },
    ],
    xaxis: {
      categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
    },
  };
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      scale: [null, [Validators.required]],
    });

    ///

    var chart2 = new ApexCharts(document.querySelector('.test'), this.options);
    var chart = new ApexCharts(document.querySelector('.test2'), this.options2);
    chart.render();
    chart2.render();
  }

  onSubmit(form: FormGroup) {
    const {
      value: { scale },
    } = form;
    this.toPdf(Number(scale));
  }

  async toPdf(param: number) {
    var doc = new jsPDF('p', 'pt', 'a4');

    /////////////////////////////////////////////////////////

    /* var scaleBy = 1;
    var w = 1000;
    var h = 1000;
    var canvas = document.createElement('canvas');
    canvas.width = w * scaleBy;
    canvas.height = h * scaleBy;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    var context = canvas.getContext('2d');
    context!.scale(scaleBy, scaleBy);
    await html2canvas(document.querySelector('.test')!, {
      allowTaint: true,
      useCORS: true,
    }).then((canvas2 = canvas) => {
      let img = canvas2.toDataURL('image/png');
      doc.addImage(img, -10, 400, null as any, null as any);
    }); */

    const quality = param;
    //////////////////
    // let totalCm = (document.querySelector('.test')!.clientWidth * 2.54) / (96 * window.devicePixelRatio);
    let realWidth = String(this.options.chart.width!).slice(0, -2);
    let totalCm = (Number(realWidth) * 2.54) / (96 * window.devicePixelRatio);
    let relation = 21 / totalCm;
    //////////////////
    let width = document.querySelector('.test')!.clientWidth;
    console.log(width);
    console.log(window.devicePixelRatio);
    console.log(relation);

    html2canvas(document.querySelector('.test')!, { scale: relation }).then(
      (canvas) => {
        const pdf = new jsPDF('p', 'pt', 'a4');
        pdf.addImage(
          canvas.toDataURL('image/png'),
          'PNG',
          0,
          0,
          null as any,
          null as any
        );
        pdf.save('Final');
      }
    );

    let realWidth2 = String(this.options2.chart.width!).slice(0, -2);
    let totalCm2 = (Number(realWidth2) * 2.54) / (96 * window.devicePixelRatio);
    let relation2 = 21 / totalCm2;
    //////////////////
    let width2 = document.querySelector('.test')!.clientWidth;
    console.log(width2);
    console.log(window.devicePixelRatio);
    console.log(relation2);

    html2canvas(document.querySelector('.test2')!, { scale: relation2 }).then(
      (canvas) => {
        const pdf = new jsPDF('p', 'pt', 'a4');
        pdf.addImage(
          canvas.toDataURL('image/png'),
          'PNG',
          0,
          0,
          null as any,
          null as any
        );
        pdf.save('Final2');
      }
    );
    /////////////////////////////////////////////////////////

    /*this.response$ = ApexCharts.exec('chart1', 'dataURI');
    let res = await ApexCharts.exec('chart1', 'dataURI');
    let s: string = String(JSON.stringify(res));
    s = s.slice(11);
    s = s.slice(0, -2);
    res = s;
    let realwidth = String(this.chart.width!).slice(0, -2);
    let realheight = String(this.chart.height!).slice(0, -2);

    //doc.addImage(s, 'svg', 0, 0, Number(realwidth), Number(realheight));
    doc.addImage(s, 'svg', 0, 0, NaN, NaN);
    doc.context2d.scale(0.3, 0.3);
    //doc.save('test.pdf');*/
  }
}
