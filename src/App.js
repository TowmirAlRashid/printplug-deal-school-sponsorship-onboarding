import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import AthDeptsMainBranch from "./components/AthDeptsMainBranch";
import SchoolBranch from "./components/SchoolBranch";

const ZOHO = window.ZOHO;

function App() {
  const [initialized, setInitialized] = useState(false); // initialize the widget
  const [entity, setEntity] = useState(null); // keeps the module
  const [entityId, setEntityId] = useState(null); // keeps the module id
  const [recordData, setRecordData] = useState(null); // holds record response
  const [recordRelatedContactRoles, setRecordRelatedContactRoles] =
    useState(null);
  const [loading, setLoading] = useState(false);

  const [attachments, setAttachments] = useState({});
  const [fileErrors, setFileErrors] = useState({});

  // dynamic states for picklists
  const [athDeptsList, setAthDeptsList] = useState(null);
  const [athProductsList, setAthProductsList] = useState(null);

  // helper: calculate total size across all components
  const getTotalSize = (allAttachments) => {
    return Object.values(allAttachments)
      .flat()
      .reduce((acc, file) => acc + file.size, 0);
  };

  // called from child
  const handleAttachmentsChange = (key, files) => {
    // validate global 15MB size
    const totalSize =
      Object.values(attachments)
        .flat()
        .reduce((acc, file) => acc + file.size, 0) +
      files.reduce((acc, f) => acc + f.size, 0);

    if (totalSize > 15 * 1024 * 1024) {
      setFileErrors((prev) => ({
        ...prev,
        [key]: "Total file size cannot exceed 15MB.",
      }));
      return;
    }

    setFileErrors((prev) => ({ ...prev, [key]: "" }));
    setAttachments((prev) => ({ ...prev, [key]: files }));

    // also update RHF
    methods.setValue(`attachments.${key}`, files, { shouldValidate: true });
  };

  useEffect(() => {
    // initialize the app
    ZOHO.embeddedApp.on("PageLoad", function (data) {
      ZOHO.CRM.UI.Resize({ height: "90%", width: "60%" }); // resize the widget window
      setEntity(data?.Entity);
      setEntityId(data?.EntityId?.[0]);

      setInitialized(true);
    });

    ZOHO.embeddedApp.init();
  }, []);

  useEffect(() => {
    if (initialized) {
      const fetchData = async () => {
        const recordResp = await ZOHO.CRM.API.getRecord({
          Entity: entity,
          approved: "both",
          RecordID: entityId,
        });
        setRecordData(recordResp?.data?.[0]);

        const relatedContactRoles = await ZOHO.CRM.API.getRelatedRecords({
          Entity: entity,
          RecordID: entityId,
          RelatedList: "Contact_Roles",
          page: 1,
          per_page: 200,
        });
        setRecordRelatedContactRoles(relatedContactRoles?.data?.[0]);

        const variableResp = await ZOHO.CRM.API.getOrgVariable(
          "athletic_depts_sponsored"
        );
        let athletic_depts_sponsored_list =
          variableResp?.Success?.Content?.split(",");
        setAthDeptsList(athletic_depts_sponsored_list);

        const variable2Resp = await ZOHO.CRM.API.getOrgVariable(
          "athletic_products_needed"
        );
        let athletic_products_needed_list =
          variable2Resp?.Success?.Content?.split(",");
        setAthProductsList(athletic_products_needed_list);
      };

      fetchData();
    }
  }, [initialized, entity, entityId]);

  const methods = useForm({
    defaultValues: {
      contactInfo: {
        Contact_Name: recordData?.Contact_Name?.name,
        Contact_Role: recordRelatedContactRoles?.Full_Name || "",
        Contact_Phone: recordData?.Contact_Phone,
        Contact_Email: recordData?.Contact_Email,
      },
      attachments: {},
    },
  });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = methods;

  const schoolOrAdvertiser = watch("schoolOrAdvertiser");

  const athDeptSponsered = watch("athDeptSponsered");

  const {
    fields: deptFields,
    append: appendDept,
    remove: removeDept,
  } = useFieldArray({
    control,
    name: "athDepts",
  });

  function hexToText(hex) {
    var result = "";
    for (var i = 0; i < hex.length; i += 2) {
      result += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return result;
  }

  const numberOfSchoolsSponsored = useWatch({
    control,
    name: `numberOfSchoolsSponsored`,
  });

  const {
    fields: schoolBranches,
    append: appendBranch,
    remove: removeBranch,
  } = useFieldArray({
    control,
    name: "schoolBranches",
  });

  useEffect(() => {
    const num = parseInt(numberOfSchoolsSponsored, 10);
    if (!isNaN(num) && num >= 0) {
      const currentLength = schoolBranches.length; // ✅ correct array length

      if (num > currentLength) {
        for (let i = currentLength; i < num; i++) {
          appendBranch({ name: "" });
        }
      } else if (num < currentLength) {
        for (let i = currentLength - 1; i >= num; i--) {
          removeBranch(i);
        }
      }
    }
  }, [
    numberOfSchoolsSponsored,
    schoolBranches.length,
    appendBranch,
    removeBranch,
  ]);

  const customDate = (date) => {
    const dateObj = new Date(date);
    let year = dateObj.getFullYear();
    let month = dateObj.getMonth();
    let day = dateObj.getDate();
    return `${year}-${month + 1}-${day < 10 ? `0${day}` : day}`;
  };

  const onSubmit = async (data) => {
    setLoading(true);
    console.log("Collected Form Data:", data);

    let sizeText =
      recordData?.Desired_Size !== null
        ? recordData?.Desired_Size + newLine + newLine
        : "";

    let content =
      "CONTACT INFO" +
        newLine +
        "---------------------------" +
        newLine +
        newLine +
        "Contact Name: " +
        data?.contactInfo?.Contact_Name +
        newLine +
        newLine +
        "Contact Role: " +
        data?.contactInfo?.Contact_Role ||
      "" +
        newLine +
        newLine +
        "Contact Phone: " +
        data?.contactInfo?.Contact_Phone +
        newLine +
        newLine +
        "Contact Email: " +
        data?.contactInfo?.Contact_Email +
        newLine +
        newLine +
        newLine +
        "DETAILED INFO" +
        newLine +
        "---------------------------" +
        newLine +
        newLine +
        "School or Advertiser?: " +
        data?.schoolOrAdvertiser +
        newLine +
        newLine;

    if (data?.schoolOrAdvertiser === "School") {
      content =
        content +
        "School Details" +
        newLine +
        "---------------------------" +
        newLine +
        newLine +
        "Contract Signed?: " +
        data?.contractSigned +
        newLine +
        newLine +
        "Athletic Departments Sponsored: " +
        data?.athDeptSponsered?.join(", ") +
        newLine +
        newLine;

      if (data?.athDepts?.length > 0) {
        data?.athDepts?.forEach((athdept) => {
          content =
            content +
            athdept?.name +
            ":" +
            newLine +
            "---------------------------" +
            newLine +
            newLine +
            "Different point of Contact?: " +
            athdept?.diffPointOfContact +
            newLine +
            newLine;
          if (athdept?.diffPointOfContact === "Yes") {
            content =
              content +
              "Contact Name: " +
              athdept?.contactName +
              newLine +
              newLine +
              "Contact Role: " +
              athdept?.contactRole +
              newLine +
              newLine +
              "Contact Number: " +
              athdept?.contactNumber +
              newLine +
              newLine +
              "Contact Email: " +
              athdept?.contactEmail +
              newLine +
              newLine;
          }
          content =
            content +
            "Date Needed: " +
            customDate(athdept?.dateNeeded) +
            newLine +
            newLine +
            "Products Needed: " +
            athdept?.productsNeeded?.join(", ") +
            newLine +
            newLine;
          if (athdept?.athDeptProducts?.length > 0) {
            athdept?.athDeptProducts?.forEach((product) => {
              content =
                content +
                product?.name +
                ":" +
                newLine +
                "---------------------------" +
                newLine +
                newLine +
                "Amount Needed: " +
                product?.amountNeeded +
                newLine +
                newLine +
                "Logo / Graphic Print Ready?: " +
                product?.logoGraphicReady +
                newLine +
                newLine +
                "Preferred Color(s) for Logo: " +
                product?.preferredColorsForLogo +
                newLine +
                newLine +
                "Preferred Background Color: " +
                product?.preferredBgColor +
                newLine +
                newLine +
                "Sizing: " +
                product?.sizing +
                newLine +
                newLine +
                "Design Notes: " +
                product?.designNotes +
                newLine +
                newLine;
            });
          }
        });
      }
    } else if (data?.schoolOrAdvertiser === "Advertiser") {
      content =
        content +
        "Advertiser Details" +
        newLine +
        "---------------------------" +
        newLine +
        newLine +
        "# of Schools Sponsored: " +
        data?.numberOfSchoolsSponsored +
        newLine +
        newLine;

      if (Number(data?.numberOfSchoolsSponsored) > 0) {
        data?.schoolBranches?.forEach((branch, branchIndex) => {
          content =
            content +
            "School " +
            (branchIndex + 1) +
            ":" +
            newLine +
            "---------------------------" +
            newLine +
            newLine +
            "School Name: " +
            branch?.schoolName +
            newLine +
            newLine +
            "# of Depts Sponsored: " +
            branch?.numberOfDepts +
            newLine +
            newLine;
          if (Number(branch?.numberOfDepts) > 0) {
            branch?.deptBranches?.forEach((subBranch, subBranchIndex) => {
              content =
                content +
                "Department " +
                (subBranchIndex + 1) +
                ":" +
                newLine +
                "---------------------------" +
                newLine +
                newLine +
                "Department Name: " +
                subBranch?.deptName +
                newLine +
                newLine +
                "Date of Event: " +
                customDate(subBranch?.dateOfEvent) +
                newLine +
                newLine +
                "Product Placement(s): " +
                subBranch?.productPlacements
                  ?.map((prod) => prod?.name)
                  ?.join(", ") +
                newLine +
                newLine;
              if (subBranch?.productPlacements?.length > 0) {
                subBranch?.productPlacements?.forEach((prod) => {
                  content =
                    content +
                    prod?.name +
                    ":" +
                    newLine +
                    "---------------------------" +
                    newLine +
                    newLine +
                    "Ad Space Purchased?: " +
                    prod?.adSpacePurchased +
                    newLine +
                    newLine +
                    "Logo Ready? Provided?: " +
                    prod?.logoReadyProvided +
                    newLine +
                    newLine +
                    "Desired Size of Garment Delivery?: " +
                    prod?.desiredColorOfAdvertisement +
                    newLine +
                    newLine +
                    "Design Notes: " +
                    prod?.designNotes +
                    newLine +
                    newLine;

                  sizeText =
                    sizeText +
                    newLine +
                    newLine +
                    prod?.name +
                    ": " +
                    prod?.desiredColorOfAdvertisement;
                });
              }
            });
          }
        });
      }
      content = content + "Payment Rendered?: " + data?.paymentRendered;
    }

    if (sizeText !== "") {
      var config = {
        Entity: entity,
        APIData: {
          id: entityId,
          Desired_Size: sizeText,
        },
        Trigger: ["workflow"],
      };

      const fieldUpdate = await ZOHO.CRM.API.updateRecord(config);
      console.log(fieldUpdate);
    }

    // 🔹 Create the Note first
    const response = await ZOHO.CRM.API.addNotes({
      Entity: entity,
      RecordID: entityId,
      Title: "SCHOOL SPONSORSHIP ONBOARDING",
      Content: content,
    });

    if (response?.data?.[0]?.code) {
      const noteId = response?.data?.[0]?.details?.id;
      if (noteId) {
        // 🔹 Only SCHOOL type can have attachments
        if (data?.schoolOrAdvertiser === "School" && data?.attachments) {
          // Flatten attachment object { "0-0": [files], "1-0": [files] } → [files...]
          const allFiles = Object.values(data.attachments).flat();

          // Check total size (15 MB max)
          const totalSize = allFiles.reduce((sum, f) => sum + f.size, 0);
          if (totalSize > 15 * 1024 * 1024) {
            alert(
              "Total size of attachments exceeds 15MB. Please reduce file sizes."
            );
            setLoading(false);
            return;
          }

          // Upload each file
          for (let i = 0; i < allFiles.length; i++) {
            const file = allFiles[i];
            const blob = await file.arrayBuffer();
            const fileContent = new Blob([blob], { type: file.type });

            try {
              await ZOHO.CRM.API.attachFile({
                Entity: "Notes",
                RecordID: noteId,
                File: {
                  Name: file.name,
                  Content: fileContent,
                },
              });

              if (i === allFiles.length - 1) {
                ZOHO.CRM.UI.Popup.closeReload();
                setLoading(false);
              }
            } catch (err) {
              console.error("Upload failed for", file.name, err);
            }
          }

          if (allFiles.length === 0) {
            ZOHO.CRM.UI.Popup.closeReload();
            setLoading(false);
          }
        } else {
          // No attachments case
          ZOHO.CRM.UI.Popup.closeReload();
          setLoading(false);
        }
      }
    }
  };

  // Example usage
  var newLine = hexToText("0A");

  if (initialized && recordData && athDeptsList && athProductsList) {
    return (
      <Box sx={{ width: "100%" }}>
        <FormProvider {...methods}>
          <Box
            sx={{
              width: "90%",
              mx: "auto",
              bgcolor: "#F5F5F5",
              px: 2,
              py: 2,
              mb: 2,
            }}
            component="form"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Typography
              sx={{
                textAlign: "center",
                pb: "1.5rem",
                fontWeight: "bold",
                fontSize: "1.5rem",
              }}
            >
              School Sponsorship Onboarding Form
            </Typography>

            <Typography
              variant="p"
              sx={{
                pt: "1rem",
                pb: "2rem",
                fontSize: "1.2rem",
                fontWeight: "bold",
              }}
            >
              CONTACT INFO
            </Typography>

            <Box sx={{ width: "100%", mt: 2 }}>
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
                  name="contactInfo.Contact_Name"
                  defaultValue={recordData?.Contact_Name?.name || ""}
                  render={({ field }) => (
                    <TextField
                      size="small"
                      id="Contact_Name"
                      variant="outlined"
                      fullWidth
                      {...field}
                      label="Contact Name"
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="contactInfo.Contact_Role"
                  defaultValue={recordRelatedContactRoles?.Full_Name || ""}
                  render={({ field }) => (
                    <TextField
                      size="small"
                      id="Contact_Role"
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
                  name="contactInfo.Contact_Phone"
                  defaultValue={recordData?.Contact_Phone}
                  render={({ field }) => (
                    <TextField
                      size="small"
                      id="Contact_Phone"
                      variant="outlined"
                      fullWidth
                      {...field}
                      label="Contact Phone"
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="contactInfo.Contact_Email"
                  defaultValue={recordData?.Contact_Email}
                  render={({ field }) => (
                    <TextField
                      size="small"
                      id="Contact_Email"
                      variant="outlined"
                      fullWidth
                      {...field}
                      label="Contact Email"
                    />
                  )}
                />
              </Box>
            </Box>

            <Typography
              variant="p"
              sx={{
                pt: "1rem",
                pb: "2rem",
                fontSize: "1.2rem",
                fontWeight: "bold",
                mt: 4,
                mb: 2,
              }}
            >
              DETAILED INFO
            </Typography>

            <Controller
              control={control}
              name="schoolOrAdvertiser"
              rules={{ required: true }}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  id="schoolOrAdvertiser"
                  size="small"
                  options={["School", "Advertiser"]}
                  getOptionLabel={(option) => option}
                  onChange={(_, data) => field.onChange(data)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      sx={{ mb: "0.8rem", mt: "1rem" }}
                      label="School or Advertiser?"
                      error={errors["schoolOrAdvertiser"]}
                    />
                  )}
                />
              )}
            />

            {schoolOrAdvertiser === "School" && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="h6">School Details</Typography>

                <Box>
                  <Controller
                    name={`contractSigned`}
                    control={control}
                    defaultValue={false} // Set the default value of the checkbox
                    render={({ field }) => (
                      <FormGroup>
                        <FormControlLabel
                          control={<Checkbox {...field} />}
                          label="Contract Signed?"
                        />
                      </FormGroup>
                    )}
                  />
                </Box>

                <Controller
                  control={control}
                  name="athDeptSponsered"
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      multiple
                      id="athDeptSponsered"
                      size="small"
                      options={athDeptsList}
                      getOptionLabel={(option) => option}
                      onChange={(_, data) => {
                        field.onChange(data);

                        // reset and append selected departments into athDepts
                        removeDept(); // clear current
                        data.forEach((dept) =>
                          appendDept({
                            name: dept,
                          })
                        );
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          sx={{ mb: "0.8rem", mt: "1rem" }}
                          label="Athletic Departments Sponsored"
                          error={!!errors["athDeptSponsered"]}
                        />
                      )}
                    />
                  )}
                />

                {deptFields.map((item, index) => (
                  <Box
                    key={item.id}
                    sx={{
                      border: "1px solid #ccc",
                      p: 2,
                      my: 2,
                    }}
                  >
                    <AthDeptsMainBranch
                      item={item}
                      index={index}
                      setAttachments={setAttachments}
                      fileErrors={fileErrors}
                      attachments={attachments}
                      onAttachmentsChange={handleAttachmentsChange}
                      athProductsList={athProductsList}
                    />
                  </Box>
                ))}
              </Box>
            )}

            {schoolOrAdvertiser === "Advertiser" && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="h6">Advertiser Details</Typography>

                <Controller
                  control={control}
                  name={`numberOfSchoolsSponsored`}
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
                      id="numberOfSchoolsSponsored"
                      variant="outlined"
                      size="small"
                      fullWidth
                      label="# of Schools Sponsored"
                      type="number"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      sx={{ mb: "1rem", mt: "5px" }}
                    />
                  )}
                />

                {schoolBranches?.map((_, schoolIndex) => (
                  <SchoolBranch
                    key={`${schoolIndex}`}
                    branchIndex={schoolIndex}
                    athProductsList={athProductsList}
                  />
                ))}

                <Box>
                  <Controller
                    name={`paymentRendered`}
                    control={control}
                    defaultValue={false} // Set the default value of the checkbox
                    render={({ field }) => (
                      <FormGroup>
                        <FormControlLabel
                          control={<Checkbox {...field} />}
                          label="Payment Rendered?"
                        />
                      </FormGroup>
                    )}
                  />
                </Box>
              </Box>
            )}

            {/* button component */}
            <Box
              sx={{
                m: "1rem 0",
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <Button
                onClick={() => {
                  ZOHO.CRM.UI.Popup.close();
                }}
                variant="outlined"
              >
                Cancel
              </Button>

              <Button
                variant="contained"
                type="submit"
                loadingPosition="start"
                disabled={loading}
              >
                Submit Form
              </Button>
            </Box>
          </Box>
        </FormProvider>
      </Box>
    );
  } else {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: "1rem",
            margin: "20% 0",
          }}
        >
          <CircularProgress color="inherit" />
          <Typography fontWeight="bold" fontSize="1.5rem">
            Fetching Data. Please Wait...
          </Typography>
        </Box>
      </Box>
    );
  }
}

export default App;
