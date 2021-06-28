/* This example requires Tailwind CSS v2.0+ */
import React, { Fragment, useRef, useCallback } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Bundle } from "../bundles/Bundle";
import { ErrorModal } from "../modals/ErrorModal";
import { Block } from "../../context/BundleData/BundleDataProvider";

interface IBundleModal {
  open: boolean
  bundle: Block
  close: () => void
}

export default function BundleModal({ open, bundle, close }: IBundleModal) {
  const cancelButtonRef = useRef();
  // const router = useRouter()
  // const close = () => {
  //   setOpen(false)
  //   if (bundle) {
  //     router.back()
  //   }
  // }
  const handleClose = useCallback(() => {
    close();
    // router.push insecure error
    // if (bundle) {
    //   router.push("/", undefined, { shallow: true })
    // }
  }, [close]);

  // useEffect(() => {
  //   const { block } = router.query
  //   if (block === undefined) {
  //     handleClose()
  //   }
  // }, [router.query, handleClose])

  return (
    <Transition show={open}
      as={Fragment}>
      <Dialog
        as="div"
        static
        className="fixed z-10 inset-0 overflow-y-auto"
        initialFocus={cancelButtonRef}
        open={open}
        onClose={ handleClose }
      >
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              // eslint-disable-next-line max-len
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex-row justify-center">
                  {
                    bundle
                      ? <Bundle bundle={ bundle } />
                      : <ErrorModal />
                  }
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  // eslint-disable-next-line max-len
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={ handleClose }
                  ref={cancelButtonRef}
                >
                  Close
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
