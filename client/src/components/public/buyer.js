import React, { useState } from 'react'
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import { Grid } from '@material-ui/core';
import HousingIcon from '../../assets/img/illustrations/budget.svg';
import GraduateIcon from '../../assets/img/illustrations/draduate.svg';
import StudentRoomIcon from '../../assets/img/illustrations/student-room.svg';
import AllLotIcon from '../../assets/img/illustrations/all-lots.svg';
import T2Icon from '../../assets/img/illustrations/t2.svg';
import StudioIcon from '../../assets/img/illustrations/studio_objectif_achat.svg';
import Wrapper, { ListCardWrapper, CustomNumerber } from './index'
import SearchInput from '../../components/formElement/search'
import SignupForm from '../../components/form/signup';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    formControl: {
        minWidth: 200,
        borderRadius: '4px',
        border: 'solid 4px #f2f2f2',
        backgroundColor: ' #ffffff',
        ['&:focus']: {
            backgroundColor: 'none'
        }
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));
const BudgetComp = ({ handlePrev, handleNext }) => {
    const [budget, setBudget] = useState(500);
    const increment = 10;
    const handleNextClick = () => {
        console.log('okk')
        handleNext && handleNext('budget', budget)
    }
    const updateChange = (value) => setBudget(value);
    const handleUp = () => setBudget(budget => budget + increment);
    const handleDown = () => budget - increment >= 0 && setBudget(budget => budget - increment);

    return (
        <Wrapper handlePrev={handlePrev} handleNext={handleNextClick} img={HousingIcon} alt='Buget' title='Saisis ton budget maximum / mois'>
            <CustomNumerber
                value={budget}
                handleChange={updateChange}
                handleUp={handleUp}
                handleDown={handleDown}
            />
        </Wrapper>
    )
}

const SignUpComp = ({ handlePrev, handleNext, data }) => {
    const handleNextClick = () => handleNext && handleNext()

    return (
        <Wrapper title='Remplis tes informations'>
            <Grid container justify='center'>
                <Grid item xs={12} sm={6}>
                    <SignupForm data={data} handlePrev={handlePrev} handleNext={handleNextClick} />
                </Grid>
            </Grid>
        </Wrapper>
    )
}

const SearchComp = ({ handlePrev, handleNext }) => {
    const handleNextClick = () => {
        handleNext && handleNext()
    }
    return (
        <Wrapper handlePrev={handlePrev} handleNext={handleNextClick} img={HousingIcon} alt='Buget' title='Quelle est ta zone de recherche ?'>
            <SearchInput />
        </Wrapper>
    )
}

const HouseComp = ({ handlePrev, handleNext }) => (
    <ListCardWrapper
        handlePrev={handlePrev}
        handleNext={handleNext}
        name='housing_type'
        list={[
            { img: StudentRoomIcon, text: 'Une chambre étudiante', alt: 'Une chambre étudiante', slug: 'student-room' },
            { img: StudioIcon, text: 'Un studio', alt: 'Un studio', slug: 'studio' },
            { img: T2Icon, text: 'Un T2', alt: 'Un T2', slug: 't2' },
            { img: AllLotIcon, text: 'Tout m’intéresse !', alt: 'Tout m’intéresse !', slug: 'all' },
        ]}
        title='Sélectionne ton type de location'
    />
)

const SchoolComp = ({ handlePrev, handleNext }) => {
    const [school, setSchool] = useState(null);
    const classes = useStyles();

    const handleNextClick = () => {
        handleNext && handleNext('school', school)
    }
    return (
        <Wrapper handlePrev={handlePrev} handleNext={handleNextClick} img={GraduateIcon} alt='Buget' title='Quelle est ta zone de recherche ?'>
            <Grid className='custom-input select' xs={12}>
                <FormControl variant="filled" className={classes.formControl}>
                    <Select
                        native
                        value={school}
                        onChange={(e) => setSchool(e.target.value)}
                        variant="outlined"
                        inputProps={{
                            name: 'age',
                            id: 'filled-age-native-simple',
                        }}
                    >
                        <option value="" />
                        <option value='hec'>HEC</option>
                        <option value='epitec'>Epitec</option>
                    </Select>
                </FormControl>
            </Grid>
        </Wrapper>
    )
}
export { HouseComp, BudgetComp, SearchComp, SchoolComp, SignUpComp }