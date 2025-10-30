"use client";

import { cn } from "@/lib/utils";
import { NumericFormat } from "react-number-format";

interface PriceFormat_SaleProps extends React.HTMLAttributes<HTMLDivElement> {
  originalPrice: number;
  salePrice?: number;
  prefix?: string;
  thousandSeparator?: string;
  decimalSeparator?: string;
  decimalScale?: number;
  showSavePercentage?: boolean;
  classNameOriginalPrice?: string;
  classNameSalePrice?: string;
  classNameSalePercentage?: string;
}

const PriceFormat_Sale: React.FC<PriceFormat_SaleProps> = ({
  className,
  classNameOriginalPrice,
  classNameSalePercentage,
  classNameSalePrice,
  decimalScale = 2,
  decimalSeparator = ".",
  originalPrice,
  prefix = "$",
  salePrice,
  showSavePercentage = false,
  thousandSeparator = ",",
}) => {
  const isSale = salePrice !== undefined && salePrice < originalPrice;
  const savePercentage = isSale
    ? ((originalPrice - salePrice) / originalPrice) * 100
    : 0;

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {isSale ? (
        <>
          <NumericFormat
            value={originalPrice}
            thousandSeparator={thousandSeparator}
            decimalSeparator={decimalSeparator}
            decimalScale={decimalScale}
            prefix={prefix}
            displayType="text"
            className={cn(
              "font-medium text-gray-500 line-through",
              classNameOriginalPrice
            )}
          />
          <NumericFormat
            value={salePrice}
            thousandSeparator={thousandSeparator}
            decimalSeparator={decimalSeparator}
            decimalScale={decimalScale}
            prefix={prefix}
            displayType="text"
            className={cn(
              "text-[length:inherit] font-medium",
              classNameSalePrice
            )}
          />
          {showSavePercentage && (
            <span
              className={cn(
                "rounded-sm bg-primary/50 p-1 text-xs ",
                classNameSalePercentage
              )}
            >
              Save {Math.round(savePercentage)}%
            </span>
          )}
        </>
      ) : (
        <NumericFormat
          value={originalPrice}
          thousandSeparator={thousandSeparator}
          decimalSeparator={decimalSeparator}
          decimalScale={decimalScale}
          prefix={prefix}
          displayType="text"
          className={cn(
            "text-[length:inherit] font-medium",
            classNameSalePrice
          )}
        />
      )}
    </div>
  );
};

export default PriceFormat_Sale;
