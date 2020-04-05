import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { pairwise } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { StadiumService } from 'src/app/services/stadium.service';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-price-create-edit',
  templateUrl: './price-create-edit.component.html',
  styleUrls: ['./price-create-edit.component.css']
})
export class PriceCreateEditComponent implements OnInit {

  @Input() stadium: any;
  @Output() updatedStadium = new EventEmitter();

  mytime: Date = new Date();
  priceForm: FormGroup;
  mdPrice: BsModalRef;

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private stadiumService: StadiumService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.initPriceForm();
  }

  initPriceForm() {
    this.priceForm = this.fb.group({
      from: [new Date(), [Validators.required]],
      to: [new Date(), [Validators.required]],
      price: ['', [Validators.required, Validators.pattern(/^[0-9]*$/), Validators.min(100000), Validators.max(2000000)]],
    });
  }

  addPrice() {
    if (this.priceForm.valid) {
      this.spinner.show();

      const price = Object.assign({}, this.priceForm.value);
      const prices = { prices: [price] };

      console.log(price);

      this.stadiumService.addPrice(prices, this.stadium._id).subscribe((newStadium) => {
        this.spinner.hide();
        this.mdPrice.hide();
        this.updatedStadium.emit(newStadium);
      }, error => {
        this.spinner.hide();
        this.toastr.error(error.error, 'Error');
        console.log(error);
      });
    }
  }


}
