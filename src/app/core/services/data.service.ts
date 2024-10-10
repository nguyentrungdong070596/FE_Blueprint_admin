import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { BehaviorSubject } from 'rxjs';
// import moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private dataSubject = new BehaviorSubject<any>(null);
  data$ = this.dataSubject.asObservable();

  setData(data: any) {
    this.dataSubject.next(data);
  }
  constructor(private _http: HttpClient) { }
  createrheader() {
    return {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
    };
  }
  get(uri: string) {
    const header = this.createrheader();
    return this._http.get(environment.apiUrl + uri, { headers: header });
  }


  GetAllNavigator(uri: string, value: any) {
    const headers = this.createrheader();
    return this._http.get(environment.apiUrl + uri, {
      params: { limit: value.limit, page: value.page },
      headers,
    });
  }
  GetCarousel(uri: string, value: any) {
    const headers = this.createrheader();
    return this._http.get(environment.apiUrl + uri, {
      params: { limit: value.limit },
      headers,
    });
  }
  GetIntroduction_Service(uri: string, value: any) {
    const headers = this.createrheader();
    return this._http.get(environment.apiUrl + uri, {
      params: {},
      headers,
    });
  }
  GetDichvu_Service(uri: string, value: any) {
    const headers = this.createrheader();
    return this._http.get(environment.apiUrl + uri, {
      params: { limit: value.limit, page: value.page, showHiddenItem: true},
      headers,
    });
  }

  // News and Service
  GetNews_Service(uri: string, value: any) {
    const headers = this.createrheader();
    return this._http.get(environment.apiUrl + uri, {
      params: { limit: value.limit, page: value.page, showHiddenItem: true},
      headers,
    });
  }
  GetManeuveringDraft_Service(uri: string, value: any) {
    const headers = this.createrheader();
    return this._http.get(environment.apiUrl + uri, {
      params: {},
      headers,
    });
  }

  GetProductPrice_Service(uri: string, value: any) {
    const headers = this.createrheader();
    return this._http.get(environment.apiUrl + uri, {
      params: { limit: value.limit, page: value.page },
      headers,
    });
  }

  GetShip_Service(uri: string, value: any) {
    const headers = this.createrheader();
    return this._http.get(environment.apiUrl + uri, {
      params: { limit: value.limit, page: value.page },
      headers,
    })
  }
  GetStream_Service(uri: string) {
    const headers = this.createrheader();
    return this._http.get(environment.apiUrl + uri, {
      params: {},
      headers
    })
  }

  post(uri: string, data?: any) {
    const header = this.createrheader();
    return this._http.post(environment.apiUrl + uri, data, { headers: header });
  }
  put(uri: string, data?: any) {
    const header = this.createrheader();
    return this._http.put(environment.apiUrl + uri, data, { headers: header });
  }
  delete(uri: string) {
    const header = this.createrheader();
    return this._http.delete(environment.apiUrl + uri, { headers: header });
  }
  // getById(uri: string, id: string) {
  //   const header = this.createrheader();
  //   return this._http.get(environment.apiUrl + uri + '/' + id, { headers: header });
  // }

  // getByDiem(uri: string, value: any) {
  //   const header = this.createrheader();
  //   return this._http.get(environment.apiUrl + uri, { params: { cangdi: value.cangdi, cangden: value.cangdi }, headers: header });
  // }

  // getCertificate(uri: string, value: any) {
  //   const header = this.createrheader();
  //   return this._http.get(environment.apiUrl + uri, { params: { userid: value.userid, ngay: value.ngay, limit: value.limit }, headers: header });
  // }

  // getDuaDonUser(uri: string, value: any) {
  //   const header = this.createrheader();
  //   return this._http.get(environment.apiUrl + uri, { params: { userid: value.userid, ngay: value.ngay, limit: value.limit }, headers: header });
  // }

  // getAllDuaDon(uri: string, value: any) {
  //   const header = this.createrheader();
  //   return this._http.get(environment.apiUrl + uri, { params: { ngay: value.ngay, limit: value.limit }, headers: header });
  // }
  // post(uri: string, data?: any) {
  //   const header = this.createrheader();
  //   return this._http.post(environment.apiUrl + uri, data, { headers: header });
  // }
  // put(uri: string, data?: any) {
  //   const header = this.createrheader();
  //   return this._http.put(environment.apiUrl + uri, data, { headers: header });
  // }
  // delete(uri: string) {
  //   const header = this.createrheader();
  //   return this._http.delete(environment.apiUrl + uri, { headers: header });
  // }
  // getSearch(uri: string, value: string) {
  //   const headers = this.createrheader(); // Corrected function name
  //   return this._http.get(environment.apiUrl + uri, {
  //     params: { name: value },
  //     headers,
  //   }); // Use params for GET request
  // }
  // getSearchUser(uri: string, value: any) {
  //   const headers = this.createrheader(); // Corrected function name
  //   return this._http.get(environment.apiUrl + uri, {
  //     params: { name: value?.name, role: value?.role },
  //     headers,
  //   }); // Use params for GET request
  // }
  // getSearchLoaiTauLai(uri: string, value: any) {
  //   const headers = this.createrheader(); // Corrected function name
  //   return this._http.get(environment.apiUrl + uri, {
  //     params: { name: value.name, loai: value.loai },
  //     headers,
  //   }); // Use params for GET request
  // }
  // getSearchLimit(uri: string, value: any) {
  //   const headers = this.createrheader(); // Corrected function name
  //   return this._http.get(environment.apiUrl + uri, {
  //     params: { ngay: value.ngay, limit: value.limit },
  //     headers,
  //   }); // Use params for GET request
  // }
  // getSearchDate(uri: string, value: any) {
  //   const headers = this.createrheader(); // Corrected function name
  //   return this._http.get(environment.apiUrl + uri, {
  //     params: { ngay: value.ngay, limit: value.limit },
  //     headers,
  //   }); // Use params for GET request
  // }
  // getSearchTime(uri: string, value: any) {
  //   const headers = this.createrheader(); // Corrected function name
  //   return this._http.get(environment.apiUrl + uri, {
  //     params: { time: value.time },
  //     headers,
  //   }); // Use params for GET request
  // }
  // getSearchLimitNameUserId(uri: string, value: any) {
  //   const headers = this.createrheader(); // Corrected function name
  //   return this._http.get(environment.apiUrl + uri, {
  //     params: { name: value.name, limit: value.limit, ngay: value.ngay, page: value.page, userid: value.userid },
  //     headers,
  //   }); // Use params for GET request
  // }
  // getSearchLimitNameNotNgay(uri: string, value: any) {
  //   const headers = this.createrheader(); // Corrected function name
  //   return this._http.get(environment.apiUrl + uri, {
  //     params: { name: value.name, limit: value.limit, page: value.page },
  //     headers,
  //   }); // Use params for GET request
  // }
  // getSearchPhieu(uri: string, value: any) {
  //   const headers = this.createrheader(); // Corrected function name
  //   return this._http.get(environment.apiUrl + uri, {
  //     params: { name: value.name, userid: value.userid, limit: value.limit, ngay: value.ngay, page: value.page },
  //     headers,
  //   }); // Use params for GET request
  // }
  // getSearchLimitNameNotDate(uri: string, value: any) {
  //   const headers = this.createrheader(); // Corrected function name
  //   return this._http.get(environment.apiUrl + uri, {
  //     params: { name: value.name, limit: value.limit },
  //     headers,
  //   }); // Use params for GET request
  // }
  // getSearchLimitNameID(uri: string, value: any) {
  //   const headers = this.createrheader(); // Corrected function name
  //   return this._http.get(environment.apiUrl + uri, {
  //     params: { name: value.name, limit: value.limit, ngay: value.ngay, id: value.id },
  //     headers,
  //   }); // Use params for GET request
  // }
  // getOrder(uri: string, dendoi: string) {
  //   const header = this.createrheader();
  //   return this._http.get(environment.apiUrl + uri, { params: { dendoi: dendoi }, headers: header });
  // }
  // getNameTuyen(uri: string, values: any) {
  //   const header = this.createrheader();
  //   return this._http.get(environment.apiUrl + uri, { params: { tu: values.tu, den: values.den }, headers: header });
  // }
  // getThuyTrieuMonNuoc(uri: string, values: any) {
  //   const header = this.createrheader();
  //   return this._http.get(environment.apiUrl + uri, { params: { drafttruoc: values.drafttruoc, draftsau: values.draftsau, gio: values.gio, ngay: values.ngay, cangid: values.cangid,cangidtu: values.cangidtu, dendoi: values.dendoi, vantoc: values.vantoc, dwt: values.dwt }, headers: header });
  // }
  // getKeHoachTau(uri: string, value: any) {
  //   const header = this.createrheader();
  //   return this._http.get(environment.apiUrl + uri, {
  //     params: { dendoi: value.dendoi, ngay: value.ngay, limit: value.limit },
  //     headers: header
  //   });
  // }
  // getSearchMDD(uri: string, value: string, mdd: string) {
  //   const headers = this.createrheader(); // Corrected function name
  //   return this._http.get(environment.apiUrl + uri, {
  //     params: { name: value, madinhdanh: mdd },
  //     headers,
  //   }); // Use params for GET request
  // }
  // getSearchThoigian(uri: string, value: string) {
  //   const headers = this.createrheader(); // Corrected function name
  //   return this._http.get(environment.apiUrl + uri, {
  //     params: { time: value },
  //     headers,
  //   }); // Use params for GET request
  // }
  // getUserDetails(userId: string) {
  //   const headers = this.createrheader();
  //   return this._http.get(environment.apiUrl + `/users/${userId}`, { headers });
  // }
  formatHours(date: string): string {
    const d = new Date(date);
    let hours = '' + d.getHours();
    let minutes = '' + d.getMinutes();
    const year = d.getFullYear();
    if (hours.length < 2) hours = '0' + hours;
    if (minutes.length < 2) minutes = '0' + minutes;
    return [hours, minutes].join(':');
  }
  formatDateToyddMMyy(date: string): string {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [day, month, year].join('/');
  }

  removeVietnameseTones(str: string): string {
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/Đ/g, "D");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/Đ/g, "D");
    str = str.replace(/đ/g, "d");
    return str;
  }
  // formatDate(dateString: string) {
  //   var result = moment(dateString).format('DD/MM/YYYY');
  //   return result;
  // }
}
