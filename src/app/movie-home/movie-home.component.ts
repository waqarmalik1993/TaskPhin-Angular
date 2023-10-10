import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-movie-home',
  templateUrl: './movie-home.component.html',
  styleUrls: ['./movie-home.component.css']
})
export class MovieHomeComponent implements OnInit {
  isFavoriteClicked: boolean = false;
  moviesData: any = []
  searchQuery: string = '';
  movies: any[] = []; // Your list of movies
  filteredMovies: any[] = [];
  addMovieForm!: FormGroup;
  editMovieForm!: FormGroup;
  selectedMovie: any; // Property to store the selected movie for editing
  name: any
  page: any = 1
  total_data!: number;
  limit: any
  total_page!: number
  serachForm!: FormGroup
  search: string = ''
  indexNumber = 1
  constructor(private fb: FormBuilder, private userService: AuthService, private modalService: NgbModal, private http: HttpClient) { }

  ngOnInit(): void {
    this.page = 1; // Initialize with the first page
    this.limit = 10; // Set an appropriate initial limit
    const userData = JSON.parse(localStorage.getItem('currentUser')!)
    this.name = userData?.data.full_name
    this.http.get('assets/movies.json').subscribe((data: any) => {
      this.filteredMovies = data;
      this.movies = data;
    });
    this.addForminit()
    this.addForminit()
    this.getMovies()
  }

  get f() { return this.addMovieForm.controls; }
  addForminit() {
    this.addMovieForm = this.fb.group({
      movieName: ['', Validators.required],
      rating: ['', [Validators.required, this.ratingValidator()]],
      cast: ['', Validators.required],
      genre: ['', Validators.required],
      releaseDate: ['', Validators.required],
    });
  }
  editFormInit(movie: any) {
    this.selectedMovie = movie; 
    // Convert the ISO-8601 date string to a Date object
    const releaseDate = new Date(movie.releaseDate);
    this.editMovieForm = this.fb.group({
      movieName: [movie.name || '', Validators.required],
      rating: [movie.rating || '', [Validators.required, this.ratingValidator()]],
      cast: [movie.cast || '', Validators.required],
      genre: [movie.genre || '', Validators.required],
      releaseDate: [releaseDate.toISOString().substring(0, 10) || '', Validators.required],
    });
  }


  closeResult: string | undefined;
  open(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'myModalLabel' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  ratingValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const isValid = /^[+-]?([0-9]*[.])?[0-9]+$/.test(control.value);
      return isValid ? null : { 'invalidRating': true };
    };
  }

  addToFavorites(movie: any) {
      const formData = new FormData();
      formData.append('name', movie.movieName);
      formData.append('rating',movie.rating);
      formData.append('cast',movie.cast);
      formData.append('genre',movie.genre);
      formData.append('releaseDate',movie.releaseDate)
      this.userService.addMovies(formData).subscribe(res => {
        if (res.status == "success") {
          this.modalService.dismissAll()
          this.ngOnInit()
          Swal.fire({ icon: 'success', title: res.message, confirmButtonColor: '#d90000' })
        }
      })
  }
  onFormSubmit() {
    if (this.addMovieForm.valid) {
      const formData = new FormData();
      formData.append('name', this.addMovieForm.get('movieName')?.value);
      formData.append('rating', this.addMovieForm.get('rating')?.value);
      formData.append('cast', this.addMovieForm.get('cast')?.value);
      formData.append('genre', this.addMovieForm.get('genre')?.value);
      formData.append('releaseDate', this.addMovieForm.get('releaseDate')?.value)
      this.userService.addMovies(formData).subscribe(res => {
        if (res.status == "success") {
          this.modalService.dismissAll()
          this.ngOnInit()
          Swal.fire({ icon: 'success', title: res.message, confirmButtonColor: '#d90000' })
        }
      })
    } else {
      this.addMovieForm.markAllAsTouched();
    }
  }
  openEditModal(editmovie: any, movie: any) {
    this.editFormInit(movie); // Populate the form with the selected movie data
    this.modalService.open(editmovie, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        // Handle modal close
      },
      (reason) => {
        // Handle modal dismiss
      }
    );
  }

  onUpdateSubmit() {
    if (this.editMovieForm.valid) {
      const formData = new FormData();
      // Add the updated form data
      formData.append('name', this.editMovieForm.get('movieName')?.value);
      formData.append('rating', this.editMovieForm.get('rating')?.value);
      formData.append('cast', this.editMovieForm.get('cast')?.value);
      formData.append('genre', this.editMovieForm.get('genre')?.value);
      formData.append('releaseDate', this.editMovieForm.get('releaseDate')?.value);
  
      this.userService.editdMovies(formData,this.selectedMovie.id).subscribe((res) => {
        if (res.status == 'success') {
          this.modalService.dismissAll();
          this.ngOnInit();
          Swal.fire({ icon: 'success', title: res.message, confirmButtonColor: '#d90000' });
        }
      });
    } else {
      this.editMovieForm.markAllAsTouched();
    }
  }
  deleteMovie(movie: any) {
    // Show a confirmation dialog using Swal
    Swal.fire({
      title: 'Confirm Deletion',
      text: `Are you sure you want to delete "${movie.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        // User confirmed the deletion, proceed with API call
        this.userService.deleteMovies(movie.id).subscribe((res) => {
          if (res.status === 'success') {
            // Remove the deleted movie from the moviesData array
            this.moviesData = this.moviesData.filter((m: any) => m.id !== movie.id);
            this.ngOnInit()
            Swal.fire({
              icon:"success",
              title:"Deleted",
              text:`The movie ${movie.name} has been deleted.`,
              confirmButtonColor:"#d33"
            });
          } else {
            Swal.fire('Error', 'An error occurred while deleting the movie.', 'error');
          }
        });
      }
    });
  }
  logout() {
    this.userService.logout()
    window.location.reload()
  }
  getMovies() {
    const formData = new FormData();
    formData.append('page', this.page);
    formData.append('pageSize', this.limit);
    this.userService.getMovies().subscribe(res => {
      if (res.status == "success") {
        this.moviesData = res.movies
      }
    })
  }
  searchMovies() {
    if (this.searchQuery) {
      this.filteredMovies = this.movies.filter((movie) =>
        movie.movieName.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.filteredMovies = this.movies;
    }
  }
}
