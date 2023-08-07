using {myApplication.model as my} from '../db/model';

namespace myApplication.service;

service myService {
    entity Requests as select from my.Requests;
    entity Priorities as select from my.Priorities;
}