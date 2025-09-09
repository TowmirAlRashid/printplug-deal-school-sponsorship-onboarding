import { Alert, Autocomplete, Box, TextField, Typography } from "@mui/material";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";

const AthDeptsSecondaryBranch = ({
  item,
  index,
  product,
  productIndex,
  fileErrors,
  attachments,
  onAttachmentsChange,
}) => {
  const { control } = useFormContext();
  const key = `${index}-${productIndex}`; // unique identifier

  return (
    <Box sx={{ width: "96%", ml: "4%" }}>
      <Typography fontWeight="bold" mb={2}>
        {product?.name}
      </Typography>

      <Controller
        control={control}
        name={`athDepts.${index}.athDeptProducts.${productIndex}.amountNeeded`}
        defaultValue={""}
        render={({ field }) => (
          <TextField
            size="small"
            id="amountNeeded"
            variant="outlined"
            type="number"
            fullWidth
            {...field}
            label="Amount Needed"
          />
        )}
      />

      <Box sx={{ mt: 2 }}>
        <Typography sx={{ fontSize: "0.9rem", fontWeight: "bold", mb: 1 }}>
          File Upload (Max total: 15MB)
        </Typography>

        <input
          type="file"
          multiple
          onChange={(e) => {
            const files = Array.from(e.target.files);
            onAttachmentsChange(key, files);
          }}
        />

        {fileErrors?.[key] && (
          <Alert severity="error" sx={{ mt: 1 }}>
            {fileErrors[key]}
          </Alert>
        )}

        {attachments?.[key]?.length > 0 && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" fontWeight="bold">
              Selected Files:
            </Typography>
            <ul style={{ paddingLeft: "1rem", margin: 0 }}>
              {attachments[key].map((file, idx) => (
                <li key={idx}>
                  {file.name} - {(file.size / (1024 * 1024)).toFixed(2)} MB
                </li>
              ))}
            </ul>
          </Box>
        )}
      </Box>

      <Controller
        control={control}
        name={`athDepts.${index}.athDeptProducts.${productIndex}.logoGraphicReady`}
        render={({ field }) => (
          <Autocomplete
            {...field}
            id="logoGraphicReady"
            size="small"
            options={["Yes", "No"]}
            getOptionLabel={(option) => option}
            onChange={(_, data) => field.onChange(data)}
            renderInput={(params) => (
              <TextField
                {...params}
                sx={{ mb: "0.8rem", mt: "1rem" }}
                label="Logo / Graphic Print Ready?"
              />
            )}
          />
        )}
      />

      <Controller
        control={control}
        name={`athDepts.${index}.athDeptProducts.${productIndex}.preferredColorsForLogo`}
        defaultValue={""}
        render={({ field }) => (
          <TextField
            multiline
            rows={3}
            size="small"
            id="preferredColorsForLogo"
            variant="outlined"
            fullWidth
            label="Preferred Color(s) for Logo"
            {...field}
            sx={{ mb: "1rem", mt: "5px" }}
          />
        )}
      />

      <Controller
        control={control}
        name={`athDepts.${index}.athDeptProducts.${productIndex}.preferredBgColor`}
        defaultValue={""}
        render={({ field }) => (
          <TextField
            multiline
            rows={3}
            size="small"
            id="preferredBgColor"
            variant="outlined"
            fullWidth
            label="Preferred Background Color"
            {...field}
            sx={{ mb: "1rem", mt: "5px" }}
          />
        )}
      />

      <Controller
        control={control}
        name={`athDepts.${index}.athDeptProducts.${productIndex}.sizing`}
        defaultValue={""}
        render={({ field }) => (
          <TextField
            multiline
            rows={3}
            size="small"
            id="sizing"
            variant="outlined"
            fullWidth
            label="Sizing"
            {...field}
            sx={{ mb: "1rem", mt: "5px" }}
          />
        )}
      />

      <Controller
        control={control}
        name={`athDepts.${index}.athDeptProducts.${productIndex}.designNotes`}
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

export default AthDeptsSecondaryBranch;
