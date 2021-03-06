const EnglishModel = require("../models/English");

class EnglishController {
  static async readData(req, res) {
    try {
      const data = await EnglishModel.getAll();
      const result = [];
      data.forEach((doc) => {
        result.push(doc.data());
      });
      return res.status(200).json({ message: result });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }

  static async readOneData(req, res) {
    try {
      const param = req.params.pages;
      const data = await EnglishModel.getOne(param);
      if (!data.data()) {
        return res.status(404).json({ message: "data not found" });
      } else {
        let unordered = data.data();
        const ordered = Object.entries(unordered)
          .sort()
          .reduce((o, [k, v]) => ((o[k] = v), o), {});

        return res.status(200).json({ message: ordered });
      }
    } catch (err) {
      return res.status(404).json({ message: err });
    }
  }

  static async readSpecifyData(req, res) {
    try {
      const pages = req.params.pages;
      const section = req.params.section;
      const data = await EnglishModel.getOne(pages);
      if (!data.data()) {
        return res.status(404).json({ message: "data not found" });
      } else {
        let unordered = data.data();
        const ordered = Object.entries(unordered)
          .sort()
          .reduce((o, [k, v]) => ((o[k] = v), o), {});
        let sortedList = {};
        for (let [key, value] of Object.entries(ordered)) {
          if (key === section) {
            sortedList = value;
          }
        }
        return res.status(200).json({ message: sortedList });
      }
    } catch (err) {
      return res.status(404).json({ message: err });
    }
  }
  static async addData(req, res) {
    try {
      let pages = req.params.pages;
      let section = req.params.section;

      const dataFromDB = await EnglishModel.getAll();
      let idAllData = [];
      dataFromDB.forEach((doc) => {
        idAllData.push(doc.id);
      });
      const checkAvalaibleData = idAllData.filter((data) => data === pages);
      if (checkAvalaibleData.length > 0) {
        return res
          .status(400)
          .json({ message: "this pages has been registered before" });
      } else {
        const newData = {
          [section]: req.body,
        };
        const result = await EnglishModel.addEnglish(pages, newData);

        return res.status(201).json({ message: "success add Data" });
      }
    } catch (err) {
      return res.status(500).json({ message: err });
    }
  }

  static async updateData(req, res) {
    try {
      let pages = req.params.pages;
      let section = req.params.section;
      const updateData = {
        [section]: req.body,
      };
      const result = await EnglishModel.updateEnglish(updateData, pages);
      const refetchData = await EnglishModel.getOne(pages);

      return res.status(201).json({ message: refetchData.data() });
    } catch (err) {
      return res.status(500).json({ message: err });
    }
  }
}

module.exports = EnglishController;
