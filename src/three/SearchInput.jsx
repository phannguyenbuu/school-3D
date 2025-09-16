import React, { useEffect, useState } from 'react';
import SearchDialog from './SearchDialog';

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
  Box,
  Typography
} from '@mui/material';

export default function SearchInput({ 
  onSearchChange, schoolIndex,clr,
  title, placeholder = "Search phone or content" }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  
  const handleClick = () => {
    setOpen(true);
  };

  return (
    <>
    <Button sx={{
        px: 5,
        py:2,
        mb: 1,
        maxWidth: 400,
        fontSize: 16,
        borderRadius: 5,
        border: "1px solid #ccc",
        backgroundImage: `url('data:image/svg+xml;utf8,<svg fill="gray" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg"><path d="M15.5 14h-.79l-.28-.27a6.471 6.471 0 0 0 1.48-5.34C14.75 6.59 12.16 4 8.88 4S3 6.59 3 9.89s2.59 5.89 5.89 5.89a6.471 6.471 0 0 0 5.34-1.48l.27.28v.79l4.99 4.99 1.49-1.49-4.99-4.99zM8.88 14c-2.22 0-4.02-1.8-4.02-4.02S6.66 5.96 8.88 5.96s4.02 1.8 4.02 4.02-1.8 4.02-4.02 4.02z"/></svg>')`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 20px center',
        backgroundSize: '16px 16px',
      }}
      onClick = {handleClick}
      >

    </Button>
    
    <SearchDialog clr={clr} open={open} setOpen={setOpen} onSearchChange={onSearchChange} schoolIndex={schoolIndex}/>
    </>
  );
}


