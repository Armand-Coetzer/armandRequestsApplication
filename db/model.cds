using {cuid, managed} from '@sap/cds/common';

namespace myApplication.model;

entity Requests              : cuid, managed {
    shortDescription         : String(50);
    description              : String(5000);
    priority                 : Integer;
    archived                 : Boolean;
}

entity Priorities            : cuid, managed {
    priority                 : Integer;
    description              : String(50);
}