import {
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
import { Controller, useFormContext } from "react-hook-form";

const SchoolSecondaryBranch = ({ branchIndex, secondaryBranchIndex }) => {
  const { control } = useFormContext();

  return (
    <Box sx={{ width: "96%", ml: "4%", mb: 2 }}>
      <Typography fontWeight="bold" mb={2}>
        Department {secondaryBranchIndex + 1}
      </Typography>

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
        name={`schoolBranches.${branchIndex}.deptBranches.${secondaryBranchIndex}.numberOfProductPlacements`}
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
            id="numberOfProductPlacements"
            variant="outlined"
            size="small"
            fullWidth
            label="# of Product Placement(s)"
            type="number"
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            sx={{ mb: "1rem", mt: "1rem" }}
          />
        )}
      />

      <Controller
        name={`schoolBranches.${branchIndex}.deptBranches.${secondaryBranchIndex}.adSpacePurchased`}
        control={control}
        defaultValue={false} // Set the default value of the checkbox
        render={({ field }) => (
          <FormGroup>
            <FormControlLabel
              control={<Checkbox {...field} />}
              label="Ad Space Purchased?"
            />
          </FormGroup>
        )}
      />

      <Controller
        name={`schoolBranches.${branchIndex}.deptBranches.${secondaryBranchIndex}.logoReadyProvided`}
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
        name={`schoolBranches.${branchIndex}.deptBranches.${secondaryBranchIndex}.desiredColorOfAdvertisement`}
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
        name={`schoolBranches.${branchIndex}.deptBranches.${secondaryBranchIndex}.designNotes`}
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

export default SchoolSecondaryBranch;
