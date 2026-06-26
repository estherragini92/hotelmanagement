export const HOTEL_EVENTS = {
  BOOKINGS: "hotelBookingUpdate",
  FOOD: "hotelFoodUpdate",
  REQUESTS: "hotelRequestUpdate",
  HOUSEKEEPING: "hotelHousekeepingUpdate",
  PAYMENTS: "hotelPaymentUpdate",
  ROOMS: "hotelRoomUpdate",
  SUPPORT: "hotelSupportUpdate",
};

export const notifyHotelUpdate = (...events) => {
  events.forEach((eventName) => {
    window.dispatchEvent(new Event(eventName));
  });
};