import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import accImg from "../../assets/account.jpg";
import Address from "@/components/shopping-view/address";
import ShoppingOrders from "@/components/shopping-view/orders";

function ShoppingAccount() {
  return (
    <div className="flex flex-col min-h-screen max-w-7xl mx-auto w-full px-4 sm:px-8 py-8">
      <div className="relative h-[240px] w-full overflow-hidden rounded-2xl border border-purple-100 shadow-md mb-8">
        <img
          src={accImg}
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-950/80 via-purple-900/60 to-transparent flex items-center p-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">My Account</h1>
        </div>
      </div>
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-purple-100/80 bg-white/80 shadow-sm">
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="bg-purple-100/60 p-1 rounded-xl border border-purple-200/50 mb-6">
            <TabsTrigger
              value="orders"
              className="rounded-lg font-bold text-xs sm:text-sm data-[state=active]:bg-purple-700 data-[state=active]:text-white data-[state=active]:shadow-md transition-all px-6 py-2"
            >
              My Orders
            </TabsTrigger>
            <TabsTrigger
              value="address"
              className="rounded-lg font-bold text-xs sm:text-sm data-[state=active]:bg-purple-700 data-[state=active]:text-white data-[state=active]:shadow-md transition-all px-6 py-2"
            >
              Saved Addresses
            </TabsTrigger>
          </TabsList>
          <TabsContent value="orders">
            <ShoppingOrders />
          </TabsContent>
          <TabsContent value="address">
            <Address />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default ShoppingAccount;