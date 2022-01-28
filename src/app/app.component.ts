import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as ApexCharts from 'apexcharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexTitleSubtitle,
} from 'ng-apexcharts';

import { Observable } from 'rxjs';

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
  series: ApexAxisChartSeries = [
    { name: 'Especie', data: [1, 2, 3, 4, 45, 5] },
  ];
  chart: ApexChart = {
    id: 'chart1',
    type: 'bar',
    width: '1000px',
    height: '500px',
  };

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      scale: [null, [Validators.required]],
    });

    ///
    var options = {
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

    var chartt = new ApexCharts(document.querySelector('.test'), options);

    chartt.render();
  }

  onSubmit(form: FormGroup) {
    const {
      value: { scale },
    } = form;
    this.toPdf(Number(scale));
  }

  async toPdf(param: number) {
    var doc = new jsPDF('p', 'pt', 'a4');
    /////////////////////
    /*let svg = document.querySelector('.test')!;

    let clonedSvgElement = svg.cloneNode(true);
    let { width, height } = { width: 1200, height: 700 };
    let outerHTML =
        'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg.outerHTML),
      blob = new Blob([outerHTML], { type: 'image/svg+xml;charset=utf-8' });
    //console.log(outerHTML);
    let URL = window.URL || window.webkitURL || window;
    let blobURL = URL.createObjectURL(blob);
    let image = new Image();
    let png;
    image.src = blobURL;
    let canvas = document.createElement('canvas');
    canvas.width = width;

    canvas.height = height;
    let context = canvas.getContext('2d');
    context!.drawImage(image, 0, 0, width, height);
    png = canvas.toDataURL();
    console.log(png);*/

    //////////////////////////
    var scaleBy = 17;
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
      doc.addImage(img, 0, 500, null as any, null as any);
    });
    //////////////////////////
    this.response$ = ApexCharts.exec('chart1', 'dataURI', {
      scale: param,
    });
    let res = await ApexCharts.exec('chart1', 'dataURI', {
      scale: param,
    });
    let s: string = String(JSON.stringify(res));
    s = s.slice(11);
    s = s.slice(0, -2);
    res = s;
    let realwidth = String(this.chart.width!).slice(0, -2);
    let realheight = String(this.chart.height!).slice(0, -2);

    //doc.addImage(s, 'svg', 0, 0, Number(realwidth), Number(realheight));
    doc.addImage(s, 'svg', 0, 0, NaN, NaN);
    doc.save('test.pdf');
  }
}
