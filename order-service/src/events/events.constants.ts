// Event names — both order-service (publisher) and inventory-service (consumer)
// must use the exact same string. Think of these as contracts between services.

export const QUEUES = {
  INVENTORY: 'inventory_queue',
};

export const EVENTS = {
  ORDER_CREATED: 'order.created',
};