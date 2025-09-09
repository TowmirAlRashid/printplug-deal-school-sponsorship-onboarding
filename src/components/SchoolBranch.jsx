import { Box, TextField, Typography } from "@mui/material";
import React, { useEffect } from "react";
import {
  Controller,
  useFieldArray,
  useFormContext,
  useWatch,
} from "react-hook-form";
import SchoolSecondaryBranch from "./SchoolSecondaryBranch";

const SchoolBranch = ({ branchIndex }) => {
  const { control } = useFormContext();

  const numberOfDepts = useWatch({
    control,
    name: `schoolBranches.${branchIndex}.numberOfDepts`,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: `schoolBranches.${branchIndex}.deptBranches`,
  });

  useEffect(() => {
    const num = parseInt(numberOfDepts, 10);
    if (!isNaN(num) && num >= 0) {
      const currentLength = fields.length; // ✅ use array length, not string length

      if (num > currentLength) {
        for (let i = currentLength; i < num; i++) {
          append({ name: "" });
        }
      } else if (num < currentLength) {
        for (let i = currentLength - 1; i >= num; i--) {
          remove(i);
        }
      }
    }
  }, [numberOfDepts, fields.length, append, remove]);

  return (
    <Box sx={{ width: "96%", ml: "4%", mb: 2 }}>
      <Typography fontWeight="bold" mb={2}>
        School {branchIndex + 1}
      </Typography>

      <Controller
        control={control}
        name={`schoolBranches.${branchIndex}.schoolName`}
        defaultValue={""}
        render={({ field }) => (
          <TextField
            size="small"
            id="schoolName"
            variant="outlined"
            fullWidth
            {...field}
            label="School Name"
          />
        )}
      />

      <Controller
        control={control}
        name={`schoolBranches.${branchIndex}.numberOfDepts`}
        defaultValue=""
        rules={{
          validate: (value) => {
            if (value === "") return true;
            return parseInt(value) >= 0 || "Must be 0 or more";
          },
        }}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            id="numberOfDepts"
            variant="outlined"
            size="small"
            fullWidth
            label="# of Depts Sponsored"
            type="number"
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            sx={{ mb: "1rem", mt: "1rem" }}
          />
        )}
      />

      {fields?.map((_, secondaryBranchIndex) => (
        <SchoolSecondaryBranch
          key={`${secondaryBranchIndex}`}
          branchIndex={branchIndex}
          secondaryBranchIndex={secondaryBranchIndex}
        />
      ))}
    </Box>
  );
};

export default SchoolBranch;
