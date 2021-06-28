import React from "react";

export const Address = ({ address } : { address: string }) =>  {
  const size = 6;
  const shorten = (address: string): string => address.slice(0, size) + "..." + address.slice(-size);
  return <a className="flex text-sm justify-center hover:underline"
    target="_blank"
    rel="noreferrer"
    href={`https://etherscan.io/address/${ address }`}>
    <div className="text-sm text-gray-900">{ shorten(address) } </div>
  </a>;
};
