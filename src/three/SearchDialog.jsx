import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box, Stack,
  Typography,
  Grid
} from '@mui/material';
import { getBillboardHatchname } from "./PinNote";
import school_1_data from '../models/school_1_room.json';
import school_2_data from '../models/school_2_room.json';

export default function SearchDialog({open, setOpen, clr, onSearchChange,schoolIndex, ...props}) {
  const textFieldRef = useRef(null);

  const [comment, setComment] = useState('');
  const [receiver, setReceiver] = useState('');

  const [data, setData] = useState(school_1_data);
  const [searchValue, setSearchValue] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    console.log('textfiled', textFieldRef.current);
    if (open && textFieldRef.current) {
      const timer = setTimeout(() => {
        textFieldRef.current.focus();
      }, 100); // 100ms delay để đảm bảo input đã mount
      return () => clearTimeout(timer);
    }
  }, [open]);

  useEffect(() => {
    setData(schoolIndex === 0 ? school_1_data:school_2_data);
  },[schoolIndex]);


  const handleClose = () => {
    setOpen(false);
  };

  const handleSend = () => {
    console.log('Gửi comment:', comment, 'cho:', receiver);
    setOpen(false);
  };

  const handleSearch = (value) => {
    setSearchValue(value);
    const result = data.filter((el)=>el.text.toUpperCase().includes(value.toUpperCase()));
    setResults(result);
    
    // if (result && onSearchChange) {
    //   onSearchChange(result.text);
    // }
  }

  const handleClickSearchResult = (value) => {
    console.log('click',value);
    
    if(onSearchChange)
    {
      onSearchChange(value);
      setOpen(false);
    }
  }

  const getImg = (hatchname) => {
    const url = getBillboardHatchname(hatchname);
    return `/images/${url || ""}`;
  }

  return (
    <>
      <Dialog open={open} onClose={handleClose}  disableRestoreFocus 
          sx={{
          '& .MuiPaper-root': {
            minWidth: '80vw',
            height: 500,
            color:"#333",
            backgroundImage: 'url("images/panelBK_001.svg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            border: '1px solid rgba(255,255,255,0.5)',
            p: 2,
            borderRadius: 5,
            overflow:'visible',
            display: 'flex', 
            justifyContent: "flex-start"
          },
        }}>
      
        <DialogTitle>Nhập tên điểm đến hoặc số phòng</DialogTitle>
        <DialogContent>
           <TextField
              autoFocus
              label="Search"
              fullWidth
              margin="normal"
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
              inputRef={textFieldRef}
              sx={{color: clr}}
            />
          <Stack direction="row" spacing={1}>
           
            {/* <Button onClick={handleSearch}  sx={{
              px: 5,
              py: 0,
              mt: 2,
              maxWidth: 400,
              maxHeight: 60,
              fontSize: 16,
              borderRadius: 2,
              border: "1px solid #ccc",
              backgroundImage: `url('data:image/svg+xml;utf8,<svg fill="gray" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg"><path d="M15.5 14h-.79l-.28-.27a6.471 6.471 0 0 0 1.48-5.34C14.75 6.59 12.16 4 8.88 4S3 6.59 3 9.89s2.59 5.89 5.89 5.89a6.471 6.471 0 0 0 5.34-1.48l.27.28v.79l4.99 4.99 1.49-1.49-4.99-4.99zM8.88 14c-2.22 0-4.02-1.8-4.02-4.02S6.66 5.96 8.88 5.96s4.02 1.8 4.02 4.02-1.8 4.02-4.02 4.02z"/></svg>')`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 20px center',
              backgroundSize: '16px 16px',
            }}></Button> */}
          </Stack>

            <Grid container spacing={2} sx={{p:2}}>
              {results && results.map((el, index) => (
                <Grid item xs={4} key={index}>
                  <Box sx={{ minWidth: 150,maxWidth: 150, minHeight: 200, borderRadius: 2, 
                    background: "#fff",border: `1px solid ${clr}`, p:2, cursor:'pointer'
                     }}
                     onClick={() =>handleClickSearchResult(el.text)}
                     >
                    <Typography sx={{fontWeight:700, color:clr}}>{el.text.split(' ')[0]}</Typography>
                    <img src = {getImg(el.hatchname)} style={{width:100,height:'auto'}}/>
                    <Typography sx={{position:'relative', fontSize:10, top: 15, color:clr}}>
                      {`LEVEL ${el.level + 1} : ${el.text.split(' ').slice(1).join(' ')}`}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
        </DialogContent>
        <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
          <DialogActions sx={{ p: 0 }}>
            <Button onClick={handleSend} variant="contained" sx={{background:clr}}>ĐÓNG</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
}
