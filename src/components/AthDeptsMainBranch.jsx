import {
  Autocomplete,
  Box,
  FormLabel,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import React from "react";
import {
  Controller,
  useFieldArray,
  useFormContext,
  useWatch,
} from "react-hook-form";
import AthDeptsSecondaryBranch from "./AthDeptsSecondaryBranch";

const AthDeptsMainBranch = ({
  item,
  index,
  setAttachments,
  fileErrors,
  attachments,
  onAttachmentsChange,
  athProductsList,
}) => {
  const { control } = useFormContext();

  const diffPointOfContact = useWatch({
    control,
    name: `athDepts.${index}.diffPointOfContact`,
  });

  const {
    fields: deptProductFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: `athDepts.${index}.athDeptProducts`,
  });

  return (
    <Box sx={{ width: "96%", ml: "4%" }}>
      <Typography fontWeight="bold">{item?.name}</Typography>

      <Controller
        control={control}
        name={`athDepts.${index}.diffPointOfContact`}
        render={({ field }) => (
          <Autocomplete
            {...field}
            id="diffPointOfContact"
            size="small"
            options={["Yes", "No"]}
            getOptionLabel={(option) => option}
            onChange={(_, data) => field.onChange(data)}
            renderInput={(params) => (
              <TextField
                {...params}
                sx={{ mb: "0.8rem", mt: "1rem" }}
                label="Different Point of Contact?"
              />
            )}
          />
        )}
      />

      {diffPointOfContact === "Yes" && (
        <Box sx={{ width: "100%" }}>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 1,
              mb: 2,
            }}
          >
            <Controller
              control={control}
              name={`athDepts.${index}.contactName`}
              defaultValue={""}
              render={({ field }) => (
                <TextField
                  size="small"
                  id="contactName"
                  variant="outlined"
                  fullWidth
                  {...field}
                  label="Contact Name"
                />
              )}
            />

            <Controller
              control={control}
              name={`athDepts.${index}.contactRole`}
              defaultValue={""}
              render={({ field }) => (
                <TextField
                  size="small"
                  id="contactRole"
                  variant="outlined"
                  fullWidth
                  {...field}
                  label="Contact Role"
                />
              )}
            />
          </Box>

          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 1,
              mb: 2,
            }}
          >
            <Controller
              control={control}
              name={`athDepts.${index}.contactNumber`}
              defaultValue={""}
              render={({ field }) => (
                <TextField
                  size="small"
                  id="contactNumber"
                  variant="outlined"
                  fullWidth
                  {...field}
                  label="Contact Number"
                />
              )}
            />

            <Controller
              control={control}
              name={`athDepts.${index}.contactEmail`}
              defaultValue={""}
              render={({ field }) => (
                <TextField
                  size="small"
                  id="contactEmail"
                  variant="outlined"
                  fullWidth
                  {...field}
                  label="Contact Email"
                />
              )}
            />
          </Box>
        </Box>
      )}

      <Box sx={{ mb: "1rem" }}>
        <FormLabel
          id="date"
          sx={{ mb: "10px", color: "black", display: "block" }}
        >
          Date Needed
        </FormLabel>
        <Controller
          name={`athDepts.${index}.dateNeeded`}
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
        name={`athDepts.${index}.productsNeeded`}
        render={({ field }) => (
          <Autocomplete
            {...field}
            multiple
            id="productsNeeded"
            size="small"
            options={athProductsList}
            getOptionLabel={(option) => option}
            onChange={(_, data) => {
              field.onChange(data);

              remove(); // clear current
              data.forEach((product) =>
                append({
                  name: product,
                })
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                sx={{ mb: "0.8rem", mt: "1rem" }}
                label="Products Needed"
              />
            )}
          />
        )}
      />

      {deptProductFields.map((product, productIndex) => {
        return (
          <Box
            key={item.id}
            sx={{
              p: 2,
              my: 2,
              border: "1px solid #ccc",
            }}
          >
            <AthDeptsSecondaryBranch
              item={item}
              index={index}
              product={product}
              productIndex={productIndex}
              setAttachments={setAttachments}
              fileError={fileErrors}
              attachments={attachments}
              onAttachmentsChange={onAttachmentsChange}
            />
          </Box>
        );
      })}
    </Box>
  );
};

export default AthDeptsMainBranch;
