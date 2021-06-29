import { Dialog } from "@headlessui/react";
import React from "react";

export const Title = ({ blockNumber }) => {
  return <Dialog.Title as="h3"
    className="m-5 text-lg leading-6 font-medium text-gray-900">
    Bundles in #
    <a className="hover:underline"
      target="_blank"
      rel="noreferrer"
      href={`https://etherscan.io/block/${ blockNumber }`}>
      { blockNumber }
    </a>
  </Dialog.Title>;
};
