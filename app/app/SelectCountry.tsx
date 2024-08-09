import * as React from "react";
import {Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue,} from "@/components/ui/select"

export function SelectCountry() {
    return (
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select your Country" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Countries</SelectLabel>
            <SelectItem value="Argentina">Argentina</SelectItem>
            <SelectItem value="Australia">Australia</SelectItem>
            <SelectItem value="Austria">Austria</SelectItem>
            <SelectItem value="Bangladesh">Bangladesh</SelectItem>
            <SelectItem value="Belgium">Belgium</SelectItem>
            <SelectItem value="Brazil">Brazil</SelectItem>
            <SelectItem value="Canada">Canada</SelectItem>
            <SelectItem value="Chile">Chile</SelectItem>
            <SelectItem value="China">China</SelectItem>
            <SelectItem value="Colombia">Colombia</SelectItem>
            <SelectItem value="Czech Republic">Czech Republic</SelectItem>
            <SelectItem value="Denmark">Denmark</SelectItem>
            <SelectItem value="Egypt">Egypt</SelectItem>
            <SelectItem value="Finland">Finland</SelectItem>
            <SelectItem value="France">France</SelectItem>
            <SelectItem value="Germany">Germany</SelectItem>
            <SelectItem value="Greece">Greece</SelectItem>
            <SelectItem value="Hungary">Hungary</SelectItem>
            <SelectItem value="India">India</SelectItem>
            <SelectItem value="Indonesia">Indonesia</SelectItem>
            <SelectItem value="Iran">Iran</SelectItem>
            <SelectItem value="Ireland">Ireland</SelectItem>
            <SelectItem value="Israel">Israel</SelectItem>
            <SelectItem value="Italy">Italy</SelectItem>
            <SelectItem value="Japan">Japan</SelectItem>
            <SelectItem value="Kazakhstan">Kazakhstan</SelectItem>
            <SelectItem value="Malaysia">Malaysia</SelectItem>
            <SelectItem value="Mexico">Mexico</SelectItem>
            <SelectItem value="Netherlands">Netherlands</SelectItem>
            <SelectItem value="New Zealand">New Zealand</SelectItem>
            <SelectItem value="Nigeria">Nigeria</SelectItem>
            <SelectItem value="Norway">Norway</SelectItem>
            <SelectItem value="Pakistan">Pakistan</SelectItem>
            <SelectItem value="Peru">Peru</SelectItem>
            <SelectItem value="Philippines">Philippines</SelectItem>
            <SelectItem value="Poland">Poland</SelectItem>
            <SelectItem value="Portugal">Portugal</SelectItem>
            <SelectItem value="Qatar">Qatar</SelectItem>
            <SelectItem value="Romania">Romania</SelectItem>
            <SelectItem value="Russia">Russia</SelectItem>
            <SelectItem value="Saudi Arabia">Saudi Arabia</SelectItem>
            <SelectItem value="Singapore">Singapore</SelectItem>
            <SelectItem value="South Africa">South Africa</SelectItem>
            <SelectItem value="South Korea">South Korea</SelectItem>
            <SelectItem value="Spain">Spain</SelectItem>
            <SelectItem value="Sweden">Sweden</SelectItem>
            <SelectItem value="Switzerland">Switzerland</SelectItem>
            <SelectItem value="Thailand">Thailand</SelectItem>
            <SelectItem value="Turkey">Turkey</SelectItem>
            <SelectItem value="United Arab Emirates">United Arab Emirates</SelectItem>
            <SelectItem value="United Kingdom">United Kingdom</SelectItem>
            <SelectItem value="United States">United States</SelectItem>
            <SelectItem value="Vietnam">Vietnam</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    )
  }