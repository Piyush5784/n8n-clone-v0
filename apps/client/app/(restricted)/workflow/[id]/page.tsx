import React from "react";
import Nodes from "./Nodes";

const Workflow = async () => {
  const data = await axios.get("/api/v1/getAll");

  return (
    <div>
      <Nodes />
    </div>
  );
};

export default Workflow;
