import OrdersTable from "./OrdersTable";

export default function OrdersManagement() {
    return (
        <div className="bg-black relative w-full">
        <div className="blur-layer-1 absolute top-[206px] right-1/2 z-0"></div>
        <div className="blur-layer-2 absolute -top-[98px] left-1/2 z-0"></div>
    <OrdersTable/>
    </div>
    )
   
}