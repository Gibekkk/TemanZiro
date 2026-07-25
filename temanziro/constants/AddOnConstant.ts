export const ADD_ON_STATUS = {
  ACCEPTED: "accepted",
  PENDING: "pending",
  REVISION: "revision",
  REJECTED: "rejected",
}

export const ADD_ON_TYPE = {
  DOCUMENTATION: "documentation",
  TRANSPORTATION: "transportation",
}

export const DOCUMENTATION_TYPE = {
  PHOTO: "photo",
  VIDEO: "video",
};

export const TRANSPORTATION_TYPE = {
  MOTORCYCLE: "motor",
  CAR: "mobil",
};

export const ADD_ON_DETAILS = {
  [ADD_ON_TYPE.DOCUMENTATION]: {
    title: "Dokumentasi",
    options: [
      { id: DOCUMENTATION_TYPE.PHOTO, label: "Foto" },
      { id: DOCUMENTATION_TYPE.VIDEO, label: "Video" },
    ],
  },
  [ADD_ON_TYPE.TRANSPORTATION]: {
    title: "Transportasi",
    options: [
      { id: TRANSPORTATION_TYPE.MOTORCYCLE, label: "Motor" },
      { id: TRANSPORTATION_TYPE.CAR, label: "Mobil" },
    ],
  },
};

export type AddOnStatus = typeof ADD_ON_STATUS[keyof typeof ADD_ON_STATUS];
export type AddOnType = typeof ADD_ON_TYPE[keyof typeof ADD_ON_TYPE];
export type DocumentationType = typeof DOCUMENTATION_TYPE[keyof typeof DOCUMENTATION_TYPE];