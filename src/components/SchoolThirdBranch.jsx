import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";

const SchoolThirdBranch = ({
  item,
  branchIndex,
  secondaryBranchIndex,
  thirdIndex,
}) => {
  const { control } = useFormContext();

  return (
    <Box sx={{ width: "96%", ml: "4%", mb: 2 }}>
      <Typography fontWeight="bold" mb={2}>
        {item?.name}
      </Typography>

      <Controller
        control={control}
        name={`schoolBranches.${branchIndex}.deptBranches.${secondaryBranchIndex}.productPlacements.${thirdIndex}.adSpacePurchased`}
        defaultValue={""}
        render={({ field }) => (
          <TextField
            multiline
            rows={3}
            size="small"
            id="adSpacePurchased"
            variant="outlined"
            fullWidth
            label="Ad Space Purchased?"
            {...field}
            sx={{ mb: "1rem", mt: "5px" }}
          />
        )}
      />

      <Controller
        name={`schoolBranches.${branchIndex}.deptBranches.${secondaryBranchIndex}.productPlacements.${thirdIndex}.logoReadyProvided`}
        control={control}
        defaultValue={false} // Set the default value of the checkbox
        render={({ field }) => (
          <FormGroup>
            <FormControlLabel
              control={<Checkbox {...field} />}
              label="Logo Ready? Provided?"
            />
          </FormGroup>
        )}
      />

      <Controller
        control={control}
        name={`schoolBranches.${branchIndex}.deptBranches.${secondaryBranchIndex}.productPlacements.${thirdIndex}.desiredColorOfAdvertisement`}
        defaultValue={""}
        render={({ field }) => (
          <TextField
            multiline
            rows={3}
            size="small"
            id="desiredColorOfAdvertisement"
            variant="outlined"
            fullWidth
            label="Desired Color of Advertisement?"
            {...field}
            sx={{ mb: "1rem", mt: "5px" }}
          />
        )}
      />

      <Controller
        control={control}
        name={`schoolBranches.${branchIndex}.deptBranches.${secondaryBranchIndex}.productPlacements.${thirdIndex}.designNotes`}
        defaultValue={""}
        render={({ field }) => (
          <TextField
            multiline
            rows={3}
            size="small"
            id="designNotes"
            variant="outlined"
            fullWidth
            label="Design Notes"
            {...field}
            sx={{ mb: "1rem", mt: "5px" }}
          />
        )}
      />
    </Box>
  );
};

export default SchoolThirdBranch;
