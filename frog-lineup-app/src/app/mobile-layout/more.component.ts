import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mobile-more',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mobile-screen">
      <h2 class="screen-title">More Options</h2>

      <div class="options-content">
        <div class="option-group">
          <h3>Display Options</h3>
          <div class="option-item">
            <span>Switch to Desktop View</span>
            <button class="option-button" (click)="switchToDesktop()">
              <span class="material-icons">desktop_windows</span>
            </button>
          </div>
        </div>

        <div class="option-group">
          <h3>Data Management</h3>
          <div class="option-item">
            <span>Export Character Data</span>
            <button class="option-button" (click)="exportData()">
              <span class="material-icons">file_download</span>
            </button>
          </div>
          <div class="option-item">
            <span>Import Character Data</span>
            <button class="option-button" (click)="importData()">
              <span class="material-icons">file_upload</span>
            </button>
          </div>
        </div>

        <div class="option-group">
          <h3>About</h3>
          <div class="option-item">
            <span>Version 1.0.0</span>
          </div>
          <div class="option-item">
            <span>Built with Angular</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .mobile-screen {
        padding: 0;
      }

      .screen-title {
        margin: 0 0 16px 0;
        font-size: 24px;
        font-weight: 600;
        color: #333;
      }

      .options-content {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .option-group {
        background: rgba(0, 0, 0, 0.02);
        border-radius: 8px;
        padding: 16px;
      }

      .option-group h3 {
        margin: 0 0 12px 0;
        font-size: 16px;
        font-weight: 600;
        color: #333;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        padding-bottom: 8px;
      }

      .option-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 0;
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      }

      .option-item:last-child {
        border-bottom: none;
      }

      .option-item span {
        color: #666;
        font-size: 14px;
      }

      .option-button {
        background: #2196f3;
        color: white;
        border: none;
        border-radius: 20px;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .option-button:hover {
        background: #1976d2;
        transform: scale(1.05);
      }

      .option-button .material-icons {
        font-size: 18px;
      }
    `,
  ],
})
export class MobileMoreComponent {
  switchToDesktop() {
    // Navigate to desktop view or trigger responsive change
    console.log('Switching to desktop view');
    // For now, just reload without mobile route
    window.location.href = '/';
  }

  exportData() {
    console.log('Export data functionality');
    // Implement data export
  }

  importData() {
    console.log('Import data functionality');
    // Implement data import
  }
}
