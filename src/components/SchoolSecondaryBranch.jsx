import {
  Autocomplete,
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormLabel,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import React from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import SchoolThirdBranch from "./SchoolThirdBranch";

const SchoolSecondaryBranch = ({
  branchIndex,
  secondaryBranchIndex,
  athProductsList,
}) => {
  const { control } = useFormContext();

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: `schoolBranches.${branchIndex}.deptBranches.${secondaryBranchIndex}.productPlacements`,
  });

  return (
    <Box sx={{ width: "96%", ml: "4%", mb: 2 }}>
      <Typography fontWeight="bold" mb={2}>
        Department {secondaryBranchIndex + 1}
      </Typography>

      <Controller
        control={control}
        name={`schoolBranches.${branchIndex}.deptBranches.${secondaryBranchIndex}.deptName`}
        defaultValue={""}
        render={({ field }) => (
          <TextField
            size="small"
            id="deptName"
            variant="outlined"
            fullWidth
            {...field}
            label="Department Name"
            sx={{ mb: 1 }}
          />
        )}
      />

      <Box sx={{ mb: "1rem" }}>
        <FormLabel
          id="date"
          sx={{ mb: "10px", color: "black", display: "block" }}
        >
          Date of Event
        </FormLabel>
        <Controller
          name={`schoolBranches.${branchIndex}.deptBranches.${secondaryBranchIndex}.dateOfEvent`}
          control={control}
          render={({ field }) => (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                onChange={(newValue) =>
                  field.onChange(dayjs(newValue).format("YYYY/MM/DD"))
                }
                {...field}
                renderInput={(params) => (
                  <TextField
                    id="dateNeeded"
                    variant="outlined"
                    type="date"
                    sx={{
                      "& .MuiInputBase-root": {
                        height: "2.3rem !important",
                      },
                    }}
                    {...params}
                  />
                )}
              />
            </LocalizationProvider>
          )}
        />
      </Box>

      <Controller
        control={control}
        name={`schoolBranches.${branchIndex}.deptBranches.${secondaryBranchIndex}.productPlacements`}
        render={({ field }) => (
          <Autocomplete
            multiple
            options={athProductsList}
            getOptionLabel={(option) => option}
            value={fields.map((item) => item.name)} // keep selected values in sync
            onChange={(_, selected) => {
              // replace field array with new selections
              replace(selected.map((product) => ({ name: product })));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                variant="outlined"
                label="Product Placement(s)"
                sx={{ mb: 2, mt: 1 }}
              />
            )}
          />
        )}
      />

      {fields?.map((item, thirdIndex) => (
        <SchoolThirdBranch
          item={item}
          branchIndex={branchIndex}
          secondaryBranchIndex={secondaryBranchIndex}
          thirdIndex={thirdIndex}
        />
      ))}
    </Box>
  );
};

export default SchoolSecondaryBranch;
