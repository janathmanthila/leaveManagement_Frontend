import React from "react";

const AllocationLine = ({
  leaveTypes,
  handleDeleteClick,
  handleLineChange,
  key,
  ...data
}) => (
  <div className="mb-1" key={key} {...data} style={{ paddingBottom: "5px" }}>
    <div className="col-md-6">
      <select
        className="form-control"
        name="leaveTypeId"
        onChange={handleLineChange}
        required="required"
      >
        <option selected="selected" disabled="disabled" value="">
          Select Leave Type
        </option>

        {leaveTypes.map((leaveType) => (
          <option key={leaveType._id} value={leaveType._id}>
            {leaveType.leaveType}
          </option>
        ))}
      </select>
    </div>
    <div className="col-md-4">
      <input
        type="text"
        name="leaveAmount"
        placeholder="Amount"
        className="form-control"
        onChange={handleLineChange}
        required="required"
      />
    </div>
    <div className="col-md-2">
      <button type="button mb-2" onClick={handleDeleteClick}>
        X
      </button>
    </div>
  </div>
);

export default AllocationLine;
