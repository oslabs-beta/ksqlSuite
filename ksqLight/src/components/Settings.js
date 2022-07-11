import React from "react";

export const Settings = () => {
  return(
    <div className="flex-1 w-full header-viewport bg-slate-800 p-4">
      <form>
        <div className="mb-6">
          <div className="text-white text-2xl font-mono font-medium p-2">Prometheus Connection</div>
          <label htmlFor="promHost" className="pl-6 p-2 mb-2 text-left text-md font-medium text-white">Host</label>
          <input type="url" id="promHost" placeholder="http://localhost:9090/" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 p-1.5"/>
        </div>
        <div className="mb-6">
          <hr className="w-1/3"></hr>
          <div className="text-white text-2xl font-mono font-medium p-2">ksqlDB Connection</div>
          <label htmlFor="ksqldbHost" className="pl-6 p-2 mb-2 text-left text-md font-medium text-white">Host</label>
          <input type="url" id="ksqldbHost" placeholder="http://localhost:8088/" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 p-1.5"/>
        </div>
        <div className="mb-6">
          <hr className="w-1/3"></hr>
          <div className="text-white text-2xl font-mono font-medium p-2">Time Window</div>
          
        <div className="flex justify-left pl-6">
          <div className="">
            <label htmlFor="days" className="text-mono text-white flex justify-center">Days</label>
            <select id="days" className="form-select px-1.5 py-1.5 text-sm font-mono font-medium text-gray-900 rounded">
                <option value="0" selected>0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
                <option value="13">13</option>
                <option value="14">14</option>
                <option value="15">15</option>
            </select>
          </div>

          <div className="">
            <label htmlFor="hours" className="text-mono text-white flex justify-center">Hours</label>
            <select id="hours" className="block form-select px-1.5 py-1.5 text-sm font-mono font-medium text-gray-900 rounded">
                <option value="0">0</option>
                <option value="1" selected>1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
                <option value="13">13</option>
                <option value="14">14</option>
                <option value="15">15</option>
                <option value="15">16</option>
                <option value="15">17</option>
                <option value="15">18</option>
                <option value="15">19</option>
                <option value="15">20</option>
                <option value="15">21</option>
                <option value="15">22</option>
                <option value="15">23</option>
            </select>
          </div>

          <div className="">
            <label htmlFor="minutes" className="text-mono text-white flex justify-center">Mins</label>
            <select id="minutes/" className="form-select px-1.5 py-1.5 text-sm font-mono font-medium text-gray-900 rounded">
                <option value="0">0</option>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
                <option value="25">25</option>
                <option value="30" selected>30</option>
                <option value="35">35</option>
                <option value="40">40</option>
                <option value="45">45</option>
                <option value="50">50</option>
                <option value="55">55</option>
            </select>
          </div>
        </div>
        </div>
        {/* split */}
        <div className="mb-6 ">
        <hr className="w-1/3"></hr>
          <div className="text-white text-2xl font-mono font-medium py-2">Refresh Rate</div>
          
        <div className="flex justify-left pl-6">
          <div className="">
            <label htmlFor="refreshHours" className="text-mono text-white flex justify-center">Hours</label>
            <select id="refreshHours" className="form-select px-1.5 py-1.5 text-sm font-mono font-medium text-gray-900 rounded">
                <option value="0" selected>0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
                <option value="13">13</option>
                <option value="14">14</option>
                <option value="15">15</option>
                <option value="16">16</option>
                <option value="17">17</option>
                <option value="18">18</option>
                <option value="19">19</option>
                <option value="20">20</option>
                <option value="21">21</option>
                <option value="22">22</option>
                <option value="23">23</option>
                <option value="24">24</option>
            </select>
          </div>
          <div className="">
            <label htmlFor="refreshMinutes" className="text-mono text-white flex justify-center">Mins</label>
            <select id="refreshMinutes" className="form-select px-1.5 py-1.5 text-sm font-mono font-medium text-gray-900 rounded">
                <option value="0" selected>0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="30">30</option>
            </select>
          </div>
          <div className="">
            <label htmlFor="refreshSeconds" className="text-mono text-white flex justify-center">Secs</label>
            <select id="refreshSeconds" className="form-select px-1.5 py-1.5 text-sm font-mono font-medium text-gray-900 rounded">
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5" selected>5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="30">30</option>
            </select>
          </div>

        </div><br></br>
          <hr className="w-1/3"></hr>
        </div>
        {/* split */}
        <div className="mb-6 ">
          <button type="submit" className="text-white bg-cyan-700 hover:bg-sky-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
        </div>
      </form>
    </div>
  )
}

// eslint-disable-next-line no-lone-blocks
{/* <div className="overflow-x-auto">
<table className="table-auto w-full rounded-3xl border-slate-600 border-solid border-4 border-spacing-1">
  <tbody>
     <tr className=" hover:bg-gray-50">
        <td className="p-4">
          Host
        </td>
        <td className="p-4">
          <input type="text" id="fname" name="fname"/>
        </td>
     </tr>
  </tbody>
</table>
</div> */}

// eslint-disable-next-line no-lone-blocks
{/* <div className="flex-1 w-full header-viewport bg-slate-800 p-4">
      <div className="text-white text-xl p-4">Prometheus Connection</div>
      <label className="bg-slate-500 text-left text-white box-border h-4 w-4 border-l-4 border-y-4 p-2 rounded-l-lg" for="promHost">Host</label>
      <input className="text-left " type="url" placeholder="http://localhost:9090/"></input><br></br>

      <div className="text-white text-xl p-4">ksqlDB Connection</div>
      <label className="text-left text-white p-4" for="promHost">Host</label>
      <input className="text-left " type="url" placeholder="http://localhost:8088/"></input><br></br>
    </div> */}

    // <label for="timeWindow" className="pl-8 p-2 mb-2 text-left text-md font-medium text-white">Days</label>
    //         <select id="timeWindow" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
    //           <option selected>Choose a country</option>
    //           <option value="US">United States</option>
    //           <option value="CA">Canada</option>
    //           <option value="FR">France</option>
    //           <option value="DE">Germany</option>
    //         </select>