import { cn } from "@/lib/utils";
import { TTransaction } from "@/services/admin/students";
import React from "react";

type Props = {
  transaction: TTransaction;
};

function Transaction({ transaction }: Props) {
  return (
    <div key={transaction.id} className="pt-[25px]">
      <div className="flex items-center justify-between mb-[14px]">
        <div className="text-tech-grey font-medium text-base">
          {new Date(transaction.createdAt).toLocaleDateString("en-us", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </div>
        <div
          className={cn(
            " text-xs py-1 px-3 rounded-full flex items-center gap-x-1.5 font-bold",
            transaction.status === "paid" && "text-green-400 bg-green-500/10 border border-green-500/20",
            transaction.status === "pending" && "text-orange-400 bg-orange-500/10 border border-orange-500/20",
            transaction.status === "rejected" && "text-red-400 bg-red-500/10 border border-red-500/20"
          )}
        >
          <span>
            {transaction.status === "paid"
              ? "تمت بنجاح"
              : transaction.status === "pending"
              ? "قيد المراجعة"
              : "العملية مرفوضة"}
          </span>
          <div
            className={cn(
              "w-[8px] h-[8px] rounded-full inline-block ml-2",
              transaction.status === "paid" && "bg-[#12B76A]",
              transaction.status === "pending" && "bg-[#F79009]",
              transaction.status === "rejected" && "bg-[#F04438]"
            )}
          />
        </div>
      </div>
      <div className="font-bold text-white leading-relaxed">
        {transaction.type === "wallet" ? (
          transaction.status === "paid" ? (
            <>
              تم شحن{" "}
              <span className="text-primary font-black text-xl mx-1">
                {transaction.amount}
              </span>{" "}
              جنيه{" "}
            </>
          ) : transaction.status === "pending" ? (
            <>
              طلبك بشحن{" "}
              <span className="text-primary font-black text-xl mx-1">
                {transaction.amount}
              </span>{" "}
              جنيه قيد المراجعة
            </>
          ) : (
            <>
              تم رفض طلب شحن{" "}
              <span className="text-primary font-black text-xl mx-1">
                {transaction.amount}
              </span>{" "}
              جنيه{" "}
            </>
          )
        ) : (
          <>
            تم خصم{" "}
            <span className="text-primary font-black text-xl mx-1">
              {transaction.amount}
            </span>{" "}
            جنيه من المحفظة لشراء{" "}
            <span className="text-primary font-black text-xl mx-1">
              {transaction.course?.name}
            </span>{" "}
          </>
        )}
      </div>
    </div>
  );
}

export default Transaction;
