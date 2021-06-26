import React from "react"
import { Dialog } from "@headlessui/react"

export const ErrorModal = () => <div>
  <Dialog.Title as="h3"
    className="m-5 text-lg leading-6 font-medium text-gray-900">
    Oops
  </Dialog.Title>
  <div className="">Bundle not found, have this instead:  🍌</div>
</div>
