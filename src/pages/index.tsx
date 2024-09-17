import InputField from "@/components/form/InputField";
import SelectField from "@/components/form/SelectField";
import SegmentDrawer from "@/components/SegmentDrawer";
import { CustomInput, SegmentInterface } from "@/types/common";
import {
  Box,
  Center,
  Text,
  useDisclosure,
  VStack,
  HStack,
  IconButton,
  Button,
} from "@chakra-ui/react";
import Head from "next/head";
import { useFieldArray, useForm } from "react-hook-form";
import { Remove } from "@emotion-icons/material-rounded/Remove";
import { useEffect, useState } from "react";
import isEmpty from "lodash/isEmpty";
import useCustomToast, { ToastStatusEnum } from "@/hook/useCustomToast";
import { zipObject } from "lodash";
import { useApi } from "@/hook/useApi";
import api from "@/components/api";

const schemaOptions: CustomInput[] = [
  {
    label: "First Name",
    value: "first_name",
  },
  {
    label: "Last Name",
    value: "last_name",
  },
  {
    label: "Gender",
    value: "gender",
  },
  {
    label: "Age",
    value: "age",
  },
  {
    label: "Account Name",
    value: "account_name",
  },
  {
    label: "City",
    value: "city",
  },
  {
    label: "State",
    value: "state",
  },
];

const HomePage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { showToast } = useCustomToast();
  const [filteredOptions, setFilteredOptions] =
    useState<CustomInput[]>(schemaOptions);
  const { makeApiCall } = useApi();
  const segmentForm = useForm<SegmentInterface>({
    mode: "onChange",
    defaultValues: {
      segment_name: "",
      schema: [],
    },
  });

  const { control, watch } = segmentForm;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "schema",
  });

  const selectedFields = watch("schema");

  // NOTE: Removing selected options
  useEffect(() => {
    const selectedFieldsValue = selectedFields.map((field) => field.value);
    const unSelectedFields = schemaOptions.filter(
      (option) => !selectedFieldsValue.includes(option.value)
    );
    setFilteredOptions(unSelectedFields);
  }, [selectedFields.map((field) => field.value).join(",")]);

  const onSubmit = (values: SegmentInterface) => {
    if (isEmpty(values.schema)) {
      showToast({
        title: "Please add schema to save segment",
        status: ToastStatusEnum.error,
      });
      return;
    }
    const selectedSchema = schemaOptions.filter((opt) =>
      values.schema.map((sch) => sch.value).includes(opt.value)
    );
    // NOTE: converting schema as we need request object
    const requestObj = {
      ...values,
      schema: selectedSchema.map((sch) => zipObject([sch.value], [sch.label])),
    };
    // NOTE: sending segment data to server
    makeApiCall({
      apiFn: () =>
        api("/", {
          method: "POST",
          data: requestObj,
        }),
    });
  };

  const getCurrentOption = (value: string): CustomInput => {
    return (
      schemaOptions.find((opt) => opt.value === value) ?? {
        label: "",
        value: "",
      }
    );
  };

  return (
    <Box bg="white" h="100vh">
      <Head>
        <title>Home Page</title>
      </Head>
      <SegmentDrawer
        isOpen={isOpen}
        onClose={onClose}
        onFormSubmit={segmentForm.handleSubmit(onSubmit)}
      >
        <VStack alignItems="stretch" spacing={6} py={4}>
          <Text>Enter the Name of the Segment</Text>
          <InputField
            hForm={segmentForm}
            name="segment_name"
            placeholder="Name of the Segment"
            rules={{ required: true }}
          />
          <Text>
            To save your segment, you need to add the schemas to build the query
          </Text>
          {!isEmpty(fields) && (
            <VStack alignItems="stretch" spacing={5} overflowY="auto">
              {fields.map((selectedField, index) => {
                return (
                  <HStack key={`${selectedField.value}-${index}`}>
                    <SelectField
                      hForm={segmentForm}
                      name={`schema.${index}.value`}
                      rules={{ required: true }}
                      options={[
                        ...filteredOptions,
                        getCurrentOption(selectedFields[index].value), // For showing selected value in select field
                      ]}
                      placeholder="Select a schema"
                    />
                    <IconButton
                      icon={<Remove width={25} />}
                      onClick={() => remove(index)}
                      aria-label={"Remove"}
                    />
                  </HStack>
                );
              })}
            </VStack>
          )}
          <Text
            cursor="pointer"
            textDecoration="underline"
            fontSize={16}
            fontWeight={500}
            color="#39aebc"
            onClick={() => {
              if (fields.length === schemaOptions.length) {
                showToast({
                  title: "Reached max options selection",
                  status: ToastStatusEnum.warning,
                });
                return;
              }
              append({
                label: "",
                value: "",
              });
            }}
          >
            + Add new schema
          </Text>
        </VStack>
      </SegmentDrawer>
      <Box bg="#39aebc" w="100%" p={5}>
        <Text fontSize={20} fontWeight={500} color="white">
          View Audience
        </Text>
      </Box>
      <Center h="100%">
        <Button
          bg="green"
          _hover={{
            bg: "green.500",
          }}
          color="white"
          onClick={onOpen}
        >
          Save segment
        </Button>
      </Center>
    </Box>
  );
};

export default HomePage;
