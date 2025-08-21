import { Component, OnInit, ViewChild } from '@angular/core';
import { OsmTravelService } from 'src/app/services/osm-travel.service';
import * as L from 'leaflet';
import { DatePipe } from '@angular/common';
import { FormControl } from '@angular/forms';
import { startWith } from 'rxjs';
import { MatDatepicker } from '@angular/material/datepicker';
import { Travel } from 'src/app/common/travel';

const manIcon = L.icon({
  iconUrl: 'assets/icons/person-4.png',
  iconSize: [32, 32], // adjust size
  iconAnchor: [16, 32], // anchor point (center bottom)
  popupAnchor: [0, -32], // popup above the head
});

@Component({
  selector: 'osm-travel',
  templateUrl: './osm-travel.component.html',
  styleUrls: ['./osm-travel.component.css'],
})
export class OsmTravelComponent implements OnInit {
  users: string[] = [];
  userCtrl = new FormControl('ALL');
  filteredUsers: string[] = [];
  selectedUser = 'ALL';

  filteredTravels = [];
  map: L.Map;
  fromDate: any;
  toDate: any;
  fromDateTime: any;
  userName = '';
  travels: Travel[] = [];
  markers: L.Marker[] = []; 
  selectedTravel: any = null; 
  @ViewChild('fauxPicker') fauxPicker!: MatDatepicker<any>;

  constructor(
    private osmTravelService: OsmTravelService,
    private datePipe: DatePipe,
  ) {}

  ngOnInit(): void {
    let currentDate = new Date();
    let pastDate = new Date();
    this.fromDate = this.datePipe.transform(
      pastDate.setDate(currentDate.getDate() - 8),
      'yyyy-MM-dd'
    );
    this.toDate = this.datePipe.transform(currentDate, 'yyyy-MM-dd');

    this.osmTravelService.getTravels().subscribe((resp) => {
      console.log(resp);
      this.travels = resp;
      this.filteredTravels = resp;
      this.users = [
        'ALL',
        ...Array.from(new Set(this.travels.map((t) => t.user))),
      ];
      this.filteredUsers = this.users;
      this.userCtrl.valueChanges.pipe(startWith('ALL')).subscribe((value) => {
        this.filterUsers(value || '');
      });

      this.applyFilters();
    });
  }

  ngAfterViewInit(): void {
    this.map = L.map('map').setView([20.5937, 78.9629], 5); // India center
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    this.fauxPicker.open();
    this.fauxPicker.close();
  }

  filterUsers(value: string) {
    const filterValue = value.toLowerCase();
    this.filteredUsers = this.users.filter((user) =>
      user.toLowerCase().includes(filterValue)
    );
  }

  applyUserFilter(user: string) {
    this.selectedUser = user;
  }

  applyFilters() {
    this.filteredTravels = this.travels.filter((t) => {
      const travelDate = new Date(t.date).getTime();
      const afterFrom =
        !this.fromDate || travelDate >= new Date(this.fromDate).getTime();
      const beforeTo =
        !this.toDate || travelDate <= new Date(this.toDate).getTime();
      const matchUser =
        this.selectedUser === 'ALL' || t.user === this.selectedUser;
      return afterFrom && beforeTo && matchUser;
    });
    this.updateMarkers();
    this.map.setView([20.5937, 78.9629], 5);
  }

  updateMarkers() {
    if (!this.map) return;
    this.markers.forEach((m) => this.map.removeLayer(m));
    this.markers = [];
    this.filteredTravels.forEach((t) => {
      const marker = L.marker([t.lat, t.lng], { icon: manIcon })
        .addTo(this.map)
        .bindPopup(
          `<b>${t.user}</b><br>${t.date}<br><span style="color:grey">${t.reason}</span>`
        );
      this.markers.push(marker);
    });
  }

  renderListWithMap() {
    this.markers.forEach((m) => this.map.removeLayer(m));
    this.markers = [];

    this.travels.forEach((t) => {
      const marker = L.marker([t.lat, t.lng])
        .addTo(this.map)
        .bindPopup(
          `<b>${t.user}</b><br>${t.date}<br><span style="color:grey">${t.reason}<span>`
        );
      this.markers.push(marker);
    });

    this.selectedTravel = null; 
  }

  zoomToTravel(travel: any) {
    this.selectedTravel = travel; 

    const marker = this.markers.find(
      (m) =>
        m.getLatLng().lat === travel.lat && m.getLatLng().lng === travel.lng
    );
    if (marker) {
      this.map.flyTo(L.latLng(travel.lat, travel.lng), 12);
      marker.openPopup();
    }
  }

  onUserSelectFocus() {
    if (this.selectedUser === 'ALL') {
      this.filteredUsers = this.users;
    }
  }
}
