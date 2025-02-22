"use client"
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useState, useEffect } from "react";
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import { Box, Button, Typography, ButtonGroup } from "@mui/material";
import { UploadFileOutlined } from "@mui/icons-material";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import { colors } from "../../theme";
import Select from 'react-select'
import { formatDate } from "../../utils/parseDate";
import UploadCsvModal from "../upload-csv/UploadCsvModal";


const Dashboard = () => {
    const [equipments, setEquipments] = useState([]);
    const [selectedEquipment, setSelectedEquipment] = useState('EQ-0010');
    const [timeFrame, setTimeFrame] = useState('1m');
    const [averageMeasurement, setAverageMeasurement] = useState(0);
    const [dataChart, setDataChart] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);

    const { user, isLoading } = useUser();
    const router = useRouter();

    if (!isLoading && !user) {
        router.push('/api/auth/login');
    }

    console.log({user});

    const handleClickOpen = () => {
        setModalOpen(true);
    };

    const handleClose = () => {
        setModalOpen(false);
    };

    const handleFileUpload = async (file) => {
        const formData = new FormData();
        formData.append("csvFile", file);

        try {
        const response = await fetch("http://localhost:3005/api/upload-csv", {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            const result = await response.json();
            alert(`File uploaded successfully: ${result.message}`);          
        } else {
            alert("Failed to upload file");
        }
        setModalOpen(false); 
        } catch (error) {
        alert(`An error occurred while uploading the file: ${error.message}`);
        }
    };      


    const dot = (color = 'transparent') => ({
        alignItems: 'center',
        display: 'flex',    
        color: colors.greenAccent[300],
    
    ':before': {
        backgroundColor: color,
        borderRadius: 10,
        display: 'block',
        marginRight: 20,
    },
    });

    const colourStyles = {
        control: (styles) => ({ ...styles, backgroundColor: '' }),
        option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        return {
        ...styles,
        color: 'black',

        cursor: isDisabled ? 'not-allowed' : 'default',
    
        ':active': {
            ...styles[':active'],
            
        },
        };
    },
    input: (styles) => ({ ...styles, ...dot() }),
    placeholder: (styles) => ({ ...styles, ...dot('') }),
    singleValue: (styles, ) => ({ ...styles, ...dot('') }),
    };

    useEffect(() => {
        const fetchEquipments = async () => {
        const response = await fetch('http://localhost:3005/api/sensor-data');
        const data = await response.json();
        const equipmentOptions = data.map(equipment => ({
            value: equipment.id,
            label: equipment.id
        }));
        setEquipments(equipmentOptions);
        };

        fetchEquipments();
    }, []);

    useEffect(() => {
        if(!selectedEquipment) return;
        const fetchSensorData = async () => {
        const response = await fetch(`http://localhost:3005/api/sensor-average?timeframe=${timeFrame}&sensor=${selectedEquipment}`);
        const data = await response.json();
        setDataChart(data);
        
        const average = data.reduce((acc, curr) => acc + curr.value, 0) / data.length;
        setAverageMeasurement(average);    
        };

        fetchSensorData();

    }, [selectedEquipment, timeFrame]);
    

    return (
        <Box ml="20px" p="20px">
        {/* HEADER */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
            <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />

            <Box>
                <Button
                    onClick={handleClickOpen}
                    sx={{
                    backgroundColor: colors.blueAccent[700],
                    color: colors.grey[100],
                    fontSize: "14px",
                    fontWeight: "bold",
                    padding: "10px 20px",
                    }}
                >
                    <UploadFileOutlined sx={{ mr: "10px" }} />
                    Upload CSV`s
                </Button>
            </Box>
        </Box>
        {modalOpen && <UploadCsvModal  onClose={handleClose} onFileUpload={handleFileUpload} />}
        <Box mb="20px" width="350px" >
            <Select 
                options={equipments}
                noOptionsMessage={() => "...carregando"}                
                placeholder={selectedEquipment}
                styles={colourStyles}
                onChange={(option) => setSelectedEquipment(option.value)}
            />          
        </Box>
        <Box
            display="grid"
            gridTemplateColumns="repeat(12, 1fr)"
            gridAutoRows="140px"
            gap="20px"
        >
            {/* ROW 1 */}
            <Box
                gridColumn="span 8"
                gridRow="span 3"
                backgroundColor={colors.primary[400]}
                >
                    <Box display="flex" justifyContent="space-between" alignItems="center" m={2}>
                        s<ButtonGroup variant="outlined" color="primary" aria-label="Intervalo de Datas">
                            <Button
                                onClick={() => setTimeFrame("24h")}
                                variant={timeFrame === "24h" ? "contained" : "outlined"}
                            >
                                24h
                            </Button>
                            <Button
                                onClick={() => setTimeFrame("48h")}
                                variant={timeFrame === "48h" ? "contained" : "outlined"}
                            >
                                48h
                            </Button>
                            <Button
                                onClick={() => setTimeFrame("1w")}
                                variant={timeFrame === "1w" ? "contained" : "outlined"}
                            >
                                1w
                            </Button>
                            <Button
                                onClick={() => setTimeFrame("1m")}
                                variant={timeFrame === "1m" ? "contained" : "outlined"}
                            >
                                1m
                            </Button>
                        </ButtonGroup>
                    </Box>
                <Box
                    mt="25px"
                    p="0 30px"
                    display="flex "
                    justifyContent="space-between"
                    alignItems="center"
                >   
                    
                    <Box>
                    <Typography
                        variant="h6"
                        fontWeight="600"
                        color={colors.grey[100]}
                    >
                        Valor Medio
                    </Typography>
                    <Typography
                        variant="h3"
                        fontWeight="bold"
                        color={colors.greenAccent[500]}
                    >
                        {averageMeasurement ? averageMeasurement.toFixed(2): 'Sem medições no período'}
                    </Typography>
                    </Box>
            </Box>
            <Box height="250px" m="-20px 0 0 0">
                {dataChart.length > 0 && <LineChart isDashboard={true} sensor={selectedEquipment} dataChart={dataChart}/> }
            </Box>
            </Box>
            <Box
                gridColumn="span 4"
                gridRow="span 3"
                backgroundColor={colors.primary[400]}
                overflow="auto"
                >
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    borderBottom={`4px solid ${colors.primary[500]}`}
                    colors={colors.grey[100]}
                    p="15px"
                >
                    <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
                    Ultimas Mediçõess
                    </Typography>
                </Box>
                {dataChart.map((measurement, i) => (
                    <Box
                    key={`${measurement.id}-${i}`}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    borderBottom={`4px solid ${colors.primary[500]}`}
                    p="15px"
                    >
                    <Box>
                        <Typography
                        color={colors.greenAccent[500]}
                        variant="h5"
                        fontWeight="600"
                        >
                        {measurement.equipmentId}
                        </Typography>
                    </Box>
                    <Box color={colors.grey[100]}>{formatDate(measurement.timestamp)}</Box>
                    <Box
                        backgroundColor={colors.greenAccent[500]}
                        p="5px 10px"
                        borderRadius="4px"
                    >
                        {measurement.value.toFixed(2)}
                    </Box>
                    </Box>
                ))}
            </Box>
        </Box>
        </Box>
    );
};
export const getServerSideProps = withPageAuthRequired();

export default Dashboard;
