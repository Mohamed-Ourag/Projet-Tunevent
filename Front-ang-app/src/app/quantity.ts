import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QuantityService {

  constructor() {
    this.wcqib_refresh_quantity_increments();
  }

  // Method to add the increment/decrement buttons
  wcqib_refresh_quantity_increments(): void {
    const quantities = document.querySelectorAll('div.quantity:not(.buttons_added), td.quantity:not(.buttons_added)');

    quantities.forEach((quantity) => {
      const quantityElement = quantity as HTMLElement;
      quantityElement.classList.add('buttons_added');

      const minusButton = document.createElement('input');
      minusButton.type = 'button';
      minusButton.value = '-';
      minusButton.classList.add('minus');
      quantityElement.insertBefore(minusButton, quantityElement.firstChild);

      const plusButton = document.createElement('input');
      plusButton.type = 'button';
      plusButton.value = '+';
      plusButton.classList.add('plus');
      quantityElement.appendChild(plusButton);
    });
  }

  // Method to get the number of decimals
  getDecimals(value: string): number {
    const match = value.match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
    return match ? Math.max(0, (match[1] ? match[1].length : 0) - (match[2] ? +match[2] : 0)) : 0;
  }

  // Method to handle increment/decrement events
  handleQuantityChange(event: Event): void {
    const target = event.target as HTMLElement;
    const isPlusButton = target.classList.contains('plus');
    const quantityContainer = target.closest('.quantity') as HTMLElement;
    const qtyInput = quantityContainer.querySelector('.qty') as HTMLInputElement;

    let currentValue = parseFloat(qtyInput.value) || 0;
    const max = parseFloat(qtyInput.getAttribute('max') || '') || Infinity;
    const min = parseFloat(qtyInput.getAttribute('min') || '') || 0;
    const step = parseFloat(qtyInput.getAttribute('step') || '1');

    if (isPlusButton) {
      if (currentValue < max) {
        qtyInput.value = (currentValue + step).toFixed(this.getDecimals(step.toString()));
      } else {
        qtyInput.value = max.toString();
      }
    } else {
      if (currentValue > min) {
        qtyInput.value = (currentValue - step).toFixed(this.getDecimals(step.toString()));
      } else {
        qtyInput.value = min.toString();
      }
    }

    // Trigger change event manually for any other listeners
    qtyInput.dispatchEvent(new Event('change'));
  }

  // Initialization method to set up event listeners
  initialize(): void {
    document.addEventListener('DOMContentLoaded', () => {
      this.wcqib_refresh_quantity_increments();

      document.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;
        if (target.classList.contains('plus') || target.classList.contains('minus')) {
          this.handleQuantityChange(event);
        }
      });
    });
  }
}
