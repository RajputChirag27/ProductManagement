import { Component, OnInit, NgZone } from '@angular/core';
import { CategoryService } from 'src/app/core/services/category.service';
import { ProductService } from 'src/app/core/services/product.service';

@Component({
  selector: 'app-view-all-products',
  templateUrl: './view-all-products.component.html',
  styleUrls: ['./view-all-products.component.scss']
})
export class ViewAllProductsComponent implements OnInit {
  products: any[] = [];
  searchTerm: string = '';
  selectedCategory: string = '';
  categories: any[] = [];
  minPrice: number | null = null;
  maxPrice: number | null = null;
  modalImage: string | null = null;
  zoomLevel: number = 1;

  constructor(
    private readonly _productService: ProductService,
    private readonly _categoryService: CategoryService,
    private readonly ngZone: NgZone // Inject NgZone for downloadImage method
  ) {}

  ngOnInit(): void {
    this.fetchProducts();
    this.fetchCategories();
  }

  fetchProducts(): void {
    this._productService.getProducts().subscribe(
      (res: any) => {
        this.products = res.result;
        this.products.forEach(product => {
          product.image = `http://localhost:8000/uploads/${product.image}`;
        });
        console.log(this.products);
      },
      (err) => {
        console.error(err);
      }
    );
  }

  fetchCategories(): void {
    this._categoryService.getCategories().subscribe(
      (res: any) => {
        this.categories = res.result;
        console.log(this.categories);
      },
      (err) => {
        console.error('Error loading categories:', err);
      }
    );
  }

  filteredProducts(): any[] {
    return this.products.filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCategory = this.selectedCategory ? product.categoryID.name === this.selectedCategory : true;
      const matchesMinPrice = this.minPrice !== null ? product.price >= this.minPrice : true;
      const matchesMaxPrice = this.maxPrice !== null ? product.price <= this.maxPrice : true;
      return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
    });
  }

  openImageModal(image: string): void {
    this.modalImage = image;
    const modal = document.getElementById('imageModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      document.body.classList.add('modal-open');
    }
  }

  closeImageModal(): void {
    const modal = document.getElementById('imageModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      this.zoomLevel = 1;
      document.body.classList.remove('modal-open');
    }
    this.modalImage = null;
  }

  zoomIn(): void {
    this.zoomLevel *= 1.1;
    this.applyZoom();
  }

  zoomOut(): void {
    this.zoomLevel /= 1.1;
    this.applyZoom();
  }

  private applyZoom(): void {
    const img = document.querySelector('#imageModal img') as HTMLImageElement;
    if (img) {
      img.style.transform = `scale(${this.zoomLevel})`;
    }
  }

  downloadImage(): void {
    if (this.modalImage) {
      this.ngZone.run(() => {
        const link = document.createElement('a');
        (link.href as any)= this.modalImage;

        // Fetch the image from the backend to ensure it's available for download
        if (typeof this.modalImage === 'string' && this.modalImage) {
        fetch(this.modalImage)
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.blob();
          })
          .then(blob => {
            const url = window.URL.createObjectURL(blob);
            link.href = url;
            link.download = 'image.jpg'; // You might want to use a more specific filename
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
          })
          .catch(error => {
            console.error('Error fetching the image from the backend:', error);
          });
      }});
    } else {
      console.error('No image preview available.');
    }
  }
}
