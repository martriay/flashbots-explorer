import React from "react";
import { Title } from "../bundles/Title";

export const BundleError = ({ blockNumber }) => <div>
  <Title blockNumber={ blockNumber } />
  <div className="m-5">Oops, no bundles found in this block! Have this instead:  🍌</div>
</div>;
