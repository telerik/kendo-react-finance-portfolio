import * as React from 'react';
import { useParams } from 'react-router-dom';
import { DateRangePicker, DateInputProps } from '@progress/kendo-react-dateinputs';
import { addDays } from '@progress/kendo-date-math';
import { classNames } from '@progress/kendo-react-common';
import { DropDownList, ListItemProps } from '@progress/kendo-react-dropdowns';

import { ReactComponent as areaIcon } from '../../icons/area.svg';
import { ReactComponent as lineIcon } from '../../icons/line.svg';
import { ReactComponent as candleIcon } from '../../icons/candle.svg';
import {
    StockChart,
    ChartSeries,
    ChartSeriesItem,
    ChartNavigator,
    ChartNavigatorSelect,
    ChartNavigatorSeries,
    ChartNavigatorSeriesItem,
    Chart,
    ChartCategoryAxis,
    ChartCategoryAxisItem,
    ChartCategoryAxisCrosshair,
    ChartValueAxis,
    ChartValueAxisItem,
    ChartValueAxisCrosshair,
    ChartValueAxisCrosshairTooltip,
    ChartValueAxisLabels,
    ChartCategoryAxisLabels,
    ChartNavigatorCategoryAxis,
} from '@progress/kendo-react-charts';

import 'hammerjs';
import styles from './detailed.module.scss';
import { dataService } from '../../services';

const DEFAULT_RANGE = {
    start: new Date(2019, 9, 24),
    end: addDays(new Date(2019, 9, 24), 1)
}

const DEFAULT_INTERVAL = {
    unit: "hours",
    step: 1
}

enum CHART_TYPES {
    candle,
    line,
    area
}

const customItemRender = (el: React.ReactElement<HTMLLIElement>, props: ListItemProps) => (
    <el.type
        {...el.props}
        className={classNames(
            "pl-2",
            el.props.className,
            styles['ddl-list-item'],
            {
                [styles['k-state-selected']]: props.selected
            })}
    >
        <props.dataItem.icon />
        &nbsp;
        <span className="ml-3">{props.dataItem.name}</span>
    </el.type>)

const customValueRender = (el: any, value: any) => (
    <el.type
        {...el.props}
        className={classNames(
            "pl-2",
            el.props.className,
            styles['ddl-list-item'])}
    >
        {value
            ? (<><value.icon />
                &nbsp;
                <span className="ml-3">{value.name}</span></>)
            : null}

    </el.type>)

const customIntervalValueRender = (el: any, value: any) => (
    <el.type
        {...el.props}
        className={classNames(
            "pl-2",
            el.props.className,
            styles['ddl-list-item'])}
    >
        {value
            ? (<span className="ml-3">Interval {value.name}</span>)
            : null}

    </el.type >)

const ChartTypePicker = (props: any) => {
    const data = React.useMemo(() => [
        { name: 'Line', icon: lineIcon, type: CHART_TYPES.line },
        { name: 'Area', icon: areaIcon, type: CHART_TYPES.area },
        { name: 'Candle', icon: candleIcon, type: CHART_TYPES.candle }
    ], []);

    const handleChange = React.useCallback(
        (event) => {
            if (props.onChange) {
                props.onChange.call(undefined, { value: event.target.value.type })
            }
        },
        [props.onChange]
    )

    return (
        <DropDownList
            data={data}
            value={data.find(i => i.type === props.value)}
            onChange={handleChange}
            textField={'name'}
            itemRender={customItemRender}
            valueRender={customValueRender}
        />
    )
}

const ChartIntervalPicker = (props: any) => {
    const data = React.useMemo(() => [
        { name: '5M', interval: { unit: 'minutes', step: 5 } },
        { name: '15M', interval: { unit: 'minutes', step: 15 } },
        { name: '30M', interval: { unit: 'minutes', step: 30 } },
        { name: '1H', interval: { unit: 'hours', step: 1 } },
        { name: '4H', interval: { unit: 'hours', step: 4 } },
        { name: '1D', interval: { unit: 'days', step: 1 } },
        { name: '1W', interval: { unit: 'weeks', step: 1 } },
        { name: '1M', interval: { unit: 'months', step: 1 } },
        { name: '1Y', interval: { unit: 'years', step: 1 } },
    ], []);

    const handleChange = React.useCallback(
        (event) => {
            if (props.onChange) {
                console.log(event.target.value);
                props.onChange.call(undefined, { value: event.target.value.interval })
            }
        },
        [props.onChange]
    )

    return (
        <DropDownList
            data={data}
            value={data.find(i => i.interval.unit === props.value.unit && i.interval.step === props.value.step)}
            onChange={handleChange}
            textField={'name'}
            valueRender={customIntervalValueRender}
        />
    )
}

export const DetailedChart = () => {
    const { symbol } = useParams();
    const [data, setData] = React.useState<any>([]);
    const [range, setRange] = React.useState(DEFAULT_RANGE);
    const [interval, setInterval] = React.useState(DEFAULT_INTERVAL);
    const [type, setType] = React.useState<CHART_TYPES>(CHART_TYPES.candle);

    const handleChange = (event: any) => {
        setRange(event.value);
    }

    const handleTypeChange = (event: any) => {
        setType(event.value);
    }

    const handleIntervalChange = (event: any) => {
        setInterval(event.value);
    }

    const fetchData = React.useCallback(async () => {
        const newData = await dataService.getSymbol(symbol);
        setData(newData)
    }, [dataService, symbol])

    React.useEffect(() => { fetchData() }, [fetchData]);

    const chartComp: React.ReactNode = React.useMemo(() => {
        switch (type) {
            case CHART_TYPES.candle:
                return <CandleChart data={data} interval={interval} range={range} />;
            case CHART_TYPES.line:
                return <LineChart data={data} interval={interval} />;
            case CHART_TYPES.area:
                return <AreaChart data={data} interval={interval} />;
            default:
                return <LineChart data={data} interval={interval} />;
        }
    }, [type, interval, data, range]);

    return (
        <>
            <div className="row">
                <div className="col text-left">
                    <DateRangePicker
                        defaultValue={range}
                        onChange={handleChange}
                        startDateInputSettings={{ label: '' }}
                        endDateInputSettings={{ label: '' }}
                    />
                </div>
                <div className="col text-right">
                    <ChartIntervalPicker
                        value={interval}
                        onChange={handleIntervalChange}
                    />
                    <ChartTypePicker
                        value={type}
                        onChange={handleTypeChange}
                    />
                </div>
            </div>
            <div className="row mt-3">
                <div className="col">
                    {chartComp}
                </div>
            </div>
        </>
    )
}

const AreaChart = (props: any) => {
    return (<Chart>
        <ChartSeries>
            <ChartSeriesItem
                data={props.data}
                type="area"
                field="close"
                style="smooth"
                categoryField="date"
            />
        </ChartSeries>
        <ChartValueAxis>
            <ChartValueAxisItem >
                <ChartValueAxisLabels format={"{0:c}"} />
                <ChartValueAxisCrosshair >
                    <ChartValueAxisCrosshairTooltip format={"{0:c}"} />
                </ChartValueAxisCrosshair>
            </ChartValueAxisItem>
        </ChartValueAxis>
        <ChartCategoryAxis>
            <ChartCategoryAxisItem baseUnit={props.interval.unit} baseUnitStep={props.interval.step}>
                <ChartCategoryAxisCrosshair />
            </ChartCategoryAxisItem>
        </ChartCategoryAxis>
    </Chart>)
}

const LineChart = (props: any) => {
    return (<Chart>
        <ChartSeries>
            <ChartSeriesItem
                data={props.data}
                type="line"
                field="close"
                style="smooth"
                categoryField="date"
            />
        </ChartSeries>
        <ChartValueAxis>
            <ChartValueAxisItem >
                <ChartValueAxisLabels format={"{0:c}"} />
                <ChartValueAxisCrosshair >
                    <ChartValueAxisCrosshairTooltip format={"{0:c}"} />
                </ChartValueAxisCrosshair>
            </ChartValueAxisItem>
        </ChartValueAxis>
        <ChartCategoryAxis>
            <ChartCategoryAxisItem baseUnit={props.interval.unit} baseUnitStep={props.interval.step}>
                <ChartCategoryAxisCrosshair />
            </ChartCategoryAxisItem>
        </ChartCategoryAxis>
    </Chart>)
}

const CandleChart = (props: any) => {
    return (<StockChart >
        <ChartSeries>
            <ChartSeriesItem
                data={props.data}
                colorField="color"
                downColorField="color"
                type="candlestick"
                openField="open"
                closeField="close"
                lowField="low"
                highField="high"
                aggregate="avg"
                categoryField="date"
            />
            <ChartSeriesItem
                data={props.data}
                type="column"
                field={"change"}
                axis={"change"}
                colorField="color"
                categoryField="date"
            />
        </ChartSeries>
        <ChartValueAxis>
            <ChartValueAxisItem>
                <ChartValueAxisLabels format={"{0:c}"} />
                <ChartValueAxisCrosshair >
                    <ChartValueAxisCrosshairTooltip format={"{0:c}"} />
                </ChartValueAxisCrosshair>
            </ChartValueAxisItem>
            <ChartValueAxisItem min={0} max={10} visible={false} name="change">
                <ChartValueAxisLabels />
            </ChartValueAxisItem>
        </ChartValueAxis>
        <ChartCategoryAxis>
            <ChartCategoryAxisItem type="date" baseUnit={props.interval.unit} baseUnitStep={props.interval.step}>
                <ChartCategoryAxisCrosshair />
                <ChartCategoryAxisLabels visible={false} />
            </ChartCategoryAxisItem>
        </ChartCategoryAxis>
        <ChartNavigator>
            <ChartNavigatorSelect from={props.range.start} to={props.range.end} />
            <ChartNavigatorSeries >
                <ChartNavigatorSeriesItem
                    data={props.data}
                    type="area"
                    field="volume"
                    categoryField="date"
                />
            </ChartNavigatorSeries>
            <ChartNavigatorCategoryAxis type="date" baseUnit={"days"} baseUnitStep={1} />
        </ChartNavigator>
    </StockChart>)
}