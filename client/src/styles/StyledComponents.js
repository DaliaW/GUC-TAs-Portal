import { styled } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from "@material-ui/core/Grid";

export const MyButton = styled(Button)({ 
  background: 'linear-gradient(45deg, #034AA0 20%, #045CC8 90%)',
  border: 0,
  borderRadius: 5,
  boxShadow: '0 3px 5px 2px rgba(0, 90, 142, .3)',
  color: 'white',
  height: 46,
  padding: '0 14px',
  fontSize: 12
});

export const MyGrid = styled(Grid)({
  borderRadius: '15px',
  boxShadow: '0 0px 15px 0px rgba(0, 0, 0, 0.64)',
  padding: '0px',
  textAlign: 'center',
  justifyContent: 'center',
})

export const AcceptButton = styled(Button)({ 
  background: ' #058c42',
});

export const RejectButton = styled(Button)({ 
  background: '#C81927',
});
