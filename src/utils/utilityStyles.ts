export const statusStyles = (status: string) => {
  switch (status) {
    case "cancelled":
      return "bg-[#AC0F051A] text-[#AC0F05]";
    case "pending":
      return "bg-[#BC8A091A] text-[#BC8A09]";
    case "delivered":
      return "bg-[#0D875A1A] text-[#0D875A]";
    case "shipped":
      return "bg-[#0077B61A] text-[#0077B6]";
    default:
      return "bg-gray-200 text-gray-800";
  }
};

export const paidStyles = (paid: string) => {
  switch (paid) {
    case "paid":
      return "bg-[#0D875A1A] text-[#0D875A]";
    default:
      return "bg-gray-200 text-gray-800";
  }
};
